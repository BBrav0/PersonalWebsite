import { NextResponse } from 'next/server';
import { PROJECTS_REPO_CONFIG, SOFTWARE_REPO_CONFIG } from '../../../lib/github-repo-config';

const GITHUB_USERNAME = "BBrav0"; // Your GitHub username

export async function GET() {
  // Read env var at request time for Cloudflare Workers compatibility
  // Trim to handle potential whitespace/newlines in Cloudflare secrets
  const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN?.trim();
  console.log('Attempting to fetch repositories. GITHUB_TOKEN status:', GITHUB_TOKEN ? 'Loaded' : 'Not Loaded');
  if (!GITHUB_TOKEN) {
    console.error('GITHUB_PERSONAL_ACCESS_TOKEN is not set in environment variables.');
    return NextResponse.json({ message: 'Server configuration error: GitHub token missing.' }, { status: 500 });
  }

  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'BBrav0-PersonalWebsite',
  };

  try {
    // First, fetch the latest commit for PersonalWebsite without caching
    const personalWebsiteCommitsResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/PersonalWebsite/commits?per_page=1`,
      { headers }
    );
    
    let personalWebsiteLatestCommit = null;
    if (personalWebsiteCommitsResponse.ok) {
      const commits = await personalWebsiteCommitsResponse.json();
      if (Array.isArray(commits) && commits.length > 0) {
        personalWebsiteLatestCommit = commits[0].commit.author.date;
      }
    } else {
      const errorText = await personalWebsiteCommitsResponse.text();
      console.error('GitHub commits API error:', personalWebsiteCommitsResponse.status, errorText);
    }

    // Fetch all repositories for the user
    const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?type=all&sort=pushed&per_page=100`, {
      headers: headers,
    });

    if (!reposResponse.ok) {
      // Read error as text first - GitHub errors may not be valid JSON
      const errorText = await reposResponse.text();
      console.error('GitHub API error:', reposResponse.status, errorText);
      if (reposResponse.status === 403 && errorText.includes('API rate limit exceeded')) {
        return NextResponse.json({ message: 'GitHub API rate limit exceeded on server.' }, { status: 429 });
      }
      return NextResponse.json({ message: errorText || 'GitHub API error', status: reposResponse.status }, { status: reposResponse.status });
    }

    const reposData = await reposResponse.json();

    // Filter and prepare data before fetching languages to reduce subsequent calls if many repos
    const relevantRepoNames = new Set(Object.keys({
      ...PROJECTS_REPO_CONFIG,
      ...SOFTWARE_REPO_CONFIG
    }));

    const filteredRepos = reposData.filter((repo: any) => relevantRepoNames.has(repo.name));

    // Fetch languages for each filtered repo in parallel
    const reposWithLanguages = await Promise.all(
      filteredRepos.map(async (repo: any) => {
        try {
          const config = PROJECTS_REPO_CONFIG[repo.name] || SOFTWARE_REPO_CONFIG[repo.name];
          const owner = config?.owner || GITHUB_USERNAME;
          const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo.name}/languages`, {
            headers: headers,
          });

          if (!langRes.ok) {
            const langErrorText = await langRes.text();
            console.warn(`Failed to fetch languages for ${repo.name}: ${langRes.status}`, langErrorText);
            return { ...repo, languages: {} }; // Return with empty languages on error
          }

          const languages = await langRes.json();

          // If this is the PersonalWebsite repo and we have a latest commit, use that date
          if (repo.name === 'PersonalWebsite' && personalWebsiteLatestCommit) {
            return { ...repo, languages, updated_at: personalWebsiteLatestCommit };
          }

          return { ...repo, languages };
        } catch (e) {
          console.error(`Error fetching languages for ${repo.name}:`, e);
          return { ...repo, languages: {} };
        }
      })
    );

    return NextResponse.json(reposWithLanguages, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error: any) {
    console.error('Server API Error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}