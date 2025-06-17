'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Download, Filter, SortAsc, SortDesc } from "lucide-react"
import { PROJECTS_REPO_CONFIG, SOFTWARE_REPO_CONFIG, RepoConfig, CustomLink } from "@/lib/github-repo-config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Repository {
  name: string
  description: string
  html_url: string
  homepage: string
  topics: string[]
  language: string
  languages?: Record<string, number>
  owner: { login: string }
  updated_at: string
}

interface GithubProjectsProps {
  repoConfig: Record<string, RepoConfig>;
  onRateLimit?: () => void;
  onLatestUpdate?: (date: string) => void;
}

export function GithubProjects({ repoConfig, onRateLimit, onLatestUpdate }: GithubProjectsProps) {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'featured' | 'latest' | 'alphabetical'>('featured')
  const [filters, setFilters] = useState({
    languages: [] as string[],
    libraries: [] as string[],
    inProgress: false
  })

  // Get unique languages and libraries from all repos
  const allLanguages = Array.from(new Set(repos.flatMap(repo => 
    Object.keys(repo.languages || {})
  )))
  const allLibraries = Array.from(new Set(repos.flatMap(repo => 
    repoConfig[repo.name]?.libraries || []
  )))

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

        // Find the latest update date from PersonalWebsite repo
        const personalWebsiteRepo = filteredAndSortedRepos.find(repo => repo.name === 'PersonalWebsite')
        if (personalWebsiteRepo && onLatestUpdate) {
          onLatestUpdate(personalWebsiteRepo.updated_at)
        }

      } catch (error: any) {
        setError(error.message || 'An error occurred while loading projects.');
        console.error('Error fetching repositories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, [repoConfig, onRateLimit, onLatestUpdate])

  // Apply filters and sorting
  const filteredAndSortedRepos = repos
    .filter(repo => {
      if (filters.inProgress && !repoConfig[repo.name]?.inProgress) return false
      if (filters.languages.length > 0 && !Object.keys(repo.languages || {}).some(lang => filters.languages.includes(lang))) return false
      if (filters.libraries.length > 0 && !repoConfig[repo.name]?.libraries?.some(lib => filters.libraries.includes(lib))) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (repoConfig[a.name].order || 999) - (repoConfig[b.name].order || 999)
        case 'latest':
          return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
        case 'alphabetical':
          return (repoConfig[a.name]?.title || a.name).localeCompare(repoConfig[b.name]?.title || b.name)
        default:
          return 0
      }
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  if (loading) {
    return <div className="text-center">Loading projects...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <Select value={sortBy} onValueChange={(value: 'featured' | 'latest' | 'alphabetical') => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="latest">Latest Commit</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <Label>Languages</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {allLanguages.map(lang => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-${lang}`}
                        checked={filters.languages.includes(lang)}
                        onCheckedChange={(checked) => {
                          setFilters(prev => ({
                            ...prev,
                            languages: checked
                              ? [...prev.languages, lang]
                              : prev.languages.filter(l => l !== lang)
                          }))
                        }}
                      />
                      <Label htmlFor={`lang-${lang}`}>{lang}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Libraries</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {allLibraries.map(lib => (
                    <div key={lib} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lib-${lib}`}
                        checked={filters.libraries.includes(lib)}
                        onCheckedChange={(checked) => {
                          setFilters(prev => ({
                            ...prev,
                            libraries: checked
                              ? [...prev.libraries, lib]
                              : prev.libraries.filter(l => l !== lib)
                          }))
                        }}
                      />
                      <Label htmlFor={`lib-${lib}`}>{lib}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-progress"
                  checked={filters.inProgress}
                  onCheckedChange={(checked) => {
                    setFilters(prev => ({
                      ...prev,
                      inProgress: checked as boolean
                    }))
                  }}
                />
                <Label htmlFor="in-progress">In Progress Only</Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedRepos.map((repo) => (
          <Card key={repo.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{repoConfig[repo.name]?.title || repo.name}</CardTitle>
              <CardDescription>
                <div className="space-y-2">
                  <div>{repoConfig[repo.name]?.description || repo.description || 'No description available'}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Last updated: {formatDate(repo.updated_at)}
                  </div>
                </div>
              </CardDescription>
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
    </div>
  )
}

export function GithubProjectsSoftware({ onRateLimit, onLatestUpdate }: { onRateLimit?: () => void; onLatestUpdate?: (date: string) => void } = {}) {
  return <GithubProjects repoConfig={SOFTWARE_REPO_CONFIG} onRateLimit={onRateLimit} onLatestUpdate={onLatestUpdate} />;
}

export function GithubProjectsProjects({ onRateLimit, onLatestUpdate }: { onRateLimit?: () => void; onLatestUpdate?: (date: string) => void } = {}) {
  return <GithubProjects repoConfig={PROJECTS_REPO_CONFIG} onRateLimit={onRateLimit} onLatestUpdate={onLatestUpdate} />;
}