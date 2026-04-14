'use client'

import { useEffect, useMemo, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Filter, BookOpen, X } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
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

interface DisplayRepository extends Repository {
  isManual?: boolean
}

interface GithubProjectsProps {
  repoConfig: Record<string, RepoConfig>;
  onRateLimit?: () => void;
  onLatestUpdate?: (date: string) => void;
}

export function GithubProjects({ repoConfig, onRateLimit, onLatestUpdate }: GithubProjectsProps) {
  const [repos, setRepos] = useState<DisplayRepository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'featured' | 'latest' | 'alphabetical'>('featured')
  const [filters, setFilters] = useState({
    languages: [] as string[],
    libraries: [] as string[],
    inProgress: false
  })

  // State for selected repository and README content
  const [selectedRepo, setSelectedRepo] = useState<DisplayRepository | null>(null)
  const [readmeContent, setReadmeContent] = useState<string>('')
  const [readmeLoading, setReadmeLoading] = useState(false)

  // Get unique languages and libraries from all repos
  const allLanguages = Array.from(new Set(repos.flatMap(repo => 
    Object.keys(repo.languages || {})
  )))
  const allLibraries = Array.from(new Set(repos.flatMap(repo => 
    repoConfig[repo.name]?.libraries || []
  )))

  const manualRepos = useMemo<DisplayRepository[]>(
    () =>
      Object.entries(repoConfig)
        .filter(([, config]) => Boolean(config.manualRepo))
        .map(([name, config]) => ({
          name,
          description: config.description || 'No description available',
          html_url: config.manualRepo?.githubUrl || '',
          homepage: '',
          topics: [],
          language: Object.keys(config.manualRepo?.languages || {})[0] || '',
          languages: config.manualRepo?.languages || {},
          owner: { login: config.owner || '' },
          updated_at: config.manualRepo?.updatedAt || new Date(0).toISOString(),
          isManual: true,
        })),
    [repoConfig]
  )

  useEffect(() => {
    const fetchRepos = async () => {
      const fallbackToManualRepos = () => {
        if (manualRepos.length > 0) {
          setRepos(manualRepos)
          return true
        }

        return false
      }

      try {
        const response = await fetch('/api/github-repos'); 
        const data = await response.json();

        if (!response.ok) {
          const hasManualFallback = fallbackToManualRepos()

          if (response.status === 429) {
            setError(hasManualFallback ? null : 'Server-side GitHub API rate limit exceeded. Please try again later.');
          } else {
            setError(hasManualFallback ? null : data.message || 'An error occurred fetching projects.');
          }
          if (onRateLimit) {
            onRateLimit();
          }
          return;
        }
        
        if (!Array.isArray(data)) {
            throw new Error(data.message || "Unexpected response from internal API");
        }

        const filteredAndSortedRepos = data
          .filter((repo: Repository) => Object.prototype.hasOwnProperty.call(repoConfig, repo.name))
          .sort((a: Repository, b: Repository) => 
            (repoConfig[a.name].order || 999) - 
            (repoConfig[b.name].order || 999)
          ) as DisplayRepository[];

        const fetchedRepoNames = new Set(filteredAndSortedRepos.map((repo) => repo.name))
        const combinedRepos = [
          ...filteredAndSortedRepos,
          ...manualRepos.filter((repo) => !fetchedRepoNames.has(repo.name)),
        ]

        setRepos(combinedRepos);

        const personalWebsiteRepo = combinedRepos.find(repo => repo.name === 'PersonalWebsite')
        if (personalWebsiteRepo && onLatestUpdate) {
          onLatestUpdate(personalWebsiteRepo.updated_at)
        }

      } catch (error: any) {
        const hasManualFallback = fallbackToManualRepos()
        setError(hasManualFallback ? null : error.message || 'An error occurred while loading projects.');
        console.error('Error fetching repositories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, [manualRepos, repoConfig, onRateLimit, onLatestUpdate])

  // Fetch README when a repository is selected
  useEffect(() => {
    if (!selectedRepo) {
      setReadmeContent('')
      return
    }

    const selectedConfig = repoConfig[selectedRepo.name]
    if (selectedRepo.isManual) {
      setReadmeContent(selectedConfig?.detailsMarkdown || 'More details coming soon.')
      setReadmeLoading(false)
      return
    }

    if (selectedConfig?.detailsMarkdown) {
      setReadmeContent(selectedConfig.detailsMarkdown)
      setReadmeLoading(false)
      return
    }

    const controller = new AbortController()
    const fetchReadme = async () => {
      setReadmeLoading(true)
      try {
        const response = await fetch(`https://api.github.com/repos/${selectedRepo.owner.login}/${selectedRepo.name}/readme`, {
          headers: { Accept: 'application/vnd.github.v3.raw' },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('README not found')
        }

        const text = await response.text()
        setReadmeContent(text)
      } catch (err) {
        console.error('Failed to fetch README', err)
        setReadmeContent('README could not be loaded for this repository.')
      } finally {
        setReadmeLoading(false)
      }
    }

    fetchReadme()
    return () => controller.abort()
  }, [repoConfig, selectedRepo])

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
      month: 'short',
      day: 'numeric',
    })
  }

  const hasActiveFilters = filters.languages.length > 0 || filters.libraries.length > 0 || filters.inProgress

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading projects...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-destructive font-semibold">{error}</div>
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <Select value={sortBy} onValueChange={(value: 'featured' | 'latest' | 'alphabetical') => setSortBy(value)}>
          <SelectTrigger className="w-[180px] bg-card/50 border-border/50">
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
            <Button variant="outline" size="sm" className="bg-card/50 border-border/50">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Languages</Label>
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
                      <Label htmlFor={`lang-${lang}`} className="font-normal">{lang}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Libraries</Label>
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
                      <Label htmlFor={`lib-${lib}`} className="font-normal">{lib}</Label>
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
                <Label htmlFor="in-progress" className="font-normal">In Progress Only</Label>
              </div>

              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setFilters({ languages: [], libraries: [], inProgress: false })}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Main content area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Repo list */}
        <div className={`grid md:grid-cols-2 gap-4 ${selectedRepo ? 'lg:w-2/3' : 'w-full'}`}>
          {filteredAndSortedRepos.map((repo) => {
            const config = repoConfig[repo.name]
            const isSelected = selectedRepo?.name === repo.name
            const hasGithubLink = Boolean(repo.html_url)
            const hasCustomLinks = Boolean(config?.customLinks?.length)
            return (
              <div
                key={repo.name}
                onClick={() => setSelectedRepo(isSelected ? null : repo)}
                className={`rounded-xl border p-5 cursor-pointer transition-all duration-200 group ${
                  isSelected
                    ? 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/5'
                    : 'bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {config?.title || repo.name}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    {config?.inProgress && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        in progress
                      </span>
                    )}
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                  {config?.description || repo.description || 'No description available'}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 mb-3">
                  <span>Updated {formatDate(repo.updated_at)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {repo.languages &&
                    Object.entries(repo.languages)
                      .sort((a, b) => b[1] - a[1])
                      .map(([lang]) => (
                        <Badge key={lang} variant="secondary" className="text-[11px] font-normal px-2 py-0">
                          {lang}
                        </Badge>
                      ))}
                  {config?.libraries?.map((library: string) => (
                    <Badge key={library} variant="outline" className="text-[11px] font-normal px-2 py-0">
                      {library}
                    </Badge>
                  ))}
                </div>
                {(hasGithubLink || hasCustomLinks) && (
                  <div className="flex gap-2">
                    {hasGithubLink && (
                      <Button size="sm" variant="outline" className="h-8 text-xs bg-card/50 border-border/50" asChild>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <Github className="w-3.5 h-3.5 mr-1" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {config?.customLinks?.map((link: CustomLink, index: number) => (
                      <Button key={index} size="sm" variant={link.variant || 'default'} className="h-8 text-xs" asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          {link.icon}
                          {link.label}
                        </a>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* README panel */}
        {selectedRepo && (
          <div className="w-full lg:w-1/3 animate-fade-in">
            <div className="sticky top-24 rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">{repoConfig[selectedRepo.name]?.title || selectedRepo.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedRepo(null)}
                  className="p-1 rounded-md hover:bg-accent transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-5 overflow-y-auto max-h-[70vh] prose prose-sm max-w-none dark:prose-invert break-words prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary">
                {readmeLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Loading README...
                    </div>
                  </div>
                ) : readmeContent ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{readmeContent}</ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground text-sm">Click on a card to see more information!</p>
                )}
              </div>
            </div>
          </div>
        )}
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
