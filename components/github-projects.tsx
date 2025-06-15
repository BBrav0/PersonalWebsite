'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Download } from "lucide-react"
import { PROJECTS_REPO_CONFIG, SOFTWARE_REPO_CONFIG, RepoConfig, CustomLink } from "@/lib/github-repo-config";

interface Repository {
  name: string
  description: string
  html_url: string
  homepage: string
  topics: string[]
  language: string
  languages?: Record<string, number>
  owner: { login: string }
}

interface GithubProjectsProps {
  repoConfig: Record<string, RepoConfig>;
  onRateLimit?: () => void;
}

export function GithubProjects({ repoConfig, onRateLimit }: GithubProjectsProps) {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // Fetch from your own API route
        const response = await fetch('/api/github-repos'); 
        const data = await response.json();

        if (!response.ok) {
          // Handle errors from your API route
          if (response.status === 429) {
            setError('Server-side GitHub API rate limit exceeded. Please try again later.');
          } else {
            setError(data.message || 'An error occurred fetching projects.');
          }
          if (onRateLimit) {
            onRateLimit();
          }
          return;
        }
        
        if (!Array.isArray(data)) {
            throw new Error(data.message || "Unexpected response from internal API");
        }

        // Filter and sort repositories based on your client-side configuration
        // The API route sends all *relevant* repos, but you still need to sort them
        const filteredAndSortedRepos = data
          .filter((repo: Repository) => repoConfig.hasOwnProperty(repo.name))
          .sort((a: Repository, b: Repository) => 
            (repoConfig[a.name].order || 999) - 
            (repoConfig[b.name].order || 999)
          ) as Repository[]; // Cast to Repository[] to ensure type safety

        setRepos(filteredAndSortedRepos);

      } catch (error: any) {
        setError(error.message || 'An error occurred while loading projects.');
        console.error('Error fetching repositories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, [repoConfig, onRateLimit])

  if (loading) {
    return <div className="text-center">Loading projects...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold">{error}</div>
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.map((repo) => (
        <Card key={repo.name} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{repoConfig[repo.name]?.title || repo.name}</CardTitle>
            <CardDescription>{repoConfig[repo.name]?.description || repo.description || 'No description available'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {repo.languages &&
                Object.entries(repo.languages)
                  .sort((a, b) => b[1] - a[1])
                  .map(([lang, bytes]) => (
                    <Badge key={lang} variant="default">{lang}</Badge>
                  ))}
              {repoConfig[repo.name]?.libraries?.map((library: string) => (
                <Badge key={library} variant="secondary">{library}</Badge>
              ))}
              {repoConfig[repo.name]?.inProgress && (
                <Badge className="bg-red-800 text-white" variant="default">in progress</Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-1" />
                  GitHub Page
                </a>
              </Button>
              {repoConfig[repo.name]?.customLinks?.map((link: CustomLink, index: number) => (
                <Button key={index} size="sm" variant={link.variant || 'default'} asChild>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.icon}
                    {link.label}
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function GithubProjectsSoftware({ onRateLimit }: { onRateLimit?: () => void } = {}) {
  return <GithubProjects repoConfig={SOFTWARE_REPO_CONFIG} onRateLimit={onRateLimit} />;
}

export function GithubProjectsProjects({ onRateLimit }: { onRateLimit?: () => void } = {}) {
  return <GithubProjects repoConfig={PROJECTS_REPO_CONFIG} onRateLimit={onRateLimit} />;
}