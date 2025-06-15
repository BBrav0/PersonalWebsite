import { NextResponse } from 'next/server';
import { PROJECTS_REPO_CONFIG, SOFTWARE_REPO_CONFIG } from '../../../lib/github-repo-config';

const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const GITHUB_USERNAME = "BBrav0"; // Your GitHub username

export async function GET() {
  console.log('Attempting to fetch repositories. GITHUB_TOKEN status:', GITHUB_TOKEN ? 'Loaded' : 'Not Loaded');
  if (!GITHUB_TOKEN) {
    console.error('GITHUB_PERSONAL_ACCESS_TOKEN is not set in environment variables.');
    return NextResponse.json({ message: 'Server configuration error: GitHub token missing.' }, { status: 500 });
  }

  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
  };

  try {
    // Fetch all repositories for the user
    const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?type=all&sort=pushed&per_page=100`, {
      headers: headers,
      next: { revalidate: 3600 } // Revalidate data every hour (optional, for caching)
    });

    const reposData = await reposResponse.json();

    if (!reposResponse.ok) {
      // Handle GitHub API errors, including rate limits
      console.error('GitHub API error:', reposData.message);
      if (reposResponse.status === 403 && reposData.message && reposData.message.includes('API rate limit exceeded')) {
        return NextResponse.json({ message: 'GitHub API rate limit exceeded on server.' }, { status: 429 });
      }
      return NextResponse.json({ message: reposData.message || 'Failed to fetch repositories from GitHub.' }, { status: reposResponse.status || 500 });
    }

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
            next: { revalidate: 3600 } // Revalidate language data every hour
          });
          const languages = await langRes.json();

          if (!langRes.ok) {
            console.warn(`Failed to fetch languages for ${repo.name}:`, languages.message);
            return { ...repo, languages: {} }; // Return with empty languages on error
          }
          return { ...repo, languages };
        } catch (e) {
          console.error(`Error fetching languages for ${repo.name}:`, e);
          return { ...repo, languages: {} };
        }
      })
    );

    return NextResponse.json(reposWithLanguages);

  } catch (error: any) {
    console.error('Server API Error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}