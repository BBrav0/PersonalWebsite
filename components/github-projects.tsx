'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Download } from "lucide-react"

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

interface RepoConfig {
  order: number
  libraries?: string[]
  customLinks?: {
    label: string
    url: string
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    icon?: React.ReactNode
  }[]
  title?: string
  description?: string
  inProgress?: boolean
}


const PROJECTS_REPO_CONFIG: Record<string, RepoConfig> = {
  "PersonalWebsite": {
    order: 1,
    libraries: ["React","Vercel","Bun"],
    inProgress: true,
  },
  "exodrive": {
    order: 2,
    description: "Repository for the company luxury exotics rental company ExoDrive. Website: https://exodrive.co",
    libraries: ["React","Vercel","Supabase","Bun"],
    inProgress: true,
  },
  "LoLFeedbackApp": {
    title: "League of Legends Feedback App",
    order: 3,
    libraries: ["Microsoft.NET.Sdk", "WindowsForms","Riot API"],
    inProgress: true,
  },
  "VoiceCommandsPC": {
    order: 4,
    libraries: ["Gemini API"],
    inProgress: true,
  },
  "TTChat2MC": {
    title: 'TikTok Minecraft Link',
    order: 5,
    libraries: ['Maven','TikTok API', 'Minecraft Plugin'],
  }
} 

const SOFTWARE_REPO_CONFIG: Record<string, RepoConfig> = {
  'CoursePlanner': {
    title: 'Ben\'s Course Planner',
    order: 1,
    libraries: ['Tkinter'],
    customLinks: [
      {
        label: 'Download',
        url: 'https://github.com/BBrav0/CoursePlanner/releases',
        variant: 'default',
        icon: <Download className="w-4 h-4 mr-1" />
      }
    ]
  },
  'BlitzLoLLink': {
    title: 'Blitz League Link',
    order: 2,
    libraries: ['Windows Scripting']
  },
  'MidAirBlock': {
    title: 'Mid-Air Block',
    order: 3,
    libraries: ['Bukkit', 'Minecraft Plugin'],
    customLinks: [
      {
        label: 'Download',
        url: 'https://github.com/BBrav0/MidAirBlock/releases',
        variant: 'default',
        icon: <Download className="w-4 h-4 mr-1" />
      }
    ]
  },
  'ArrowRide': {
    title: 'Arrow Ride',
    order: 4,
    libraries: ['Bukkit', 'Minecraft Plugin'],
    customLinks: [
      {
        label: 'Download',
        url: 'https://github.com/BBrav0/ArrowRide/releases',
        variant: 'default',
        icon: <Download className="w-4 h-4 mr-1" />
      }
    ]
  }
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
        const response = await fetch('https://api.github.com/users/BBrav0/repos?type=all')
        const data = await response.json()

        if (!Array.isArray(data)) {
          if (data.message && data.message.includes('API rate limit exceeded')) {
            if (onRateLimit) {
              onRateLimit()
              return
            } else {
              setError('GitHub API rate limit exceeded. Projects cannot be loaded at this time. Please try again later.')
              return
            }
          } else {
            throw new Error(data.message || "Unexpected response from GitHub API")
          }
        }
        
        // Filter and sort repositories based on configuration
        const filteredRepos = data
          .filter((repo: Repository) => repoConfig.hasOwnProperty(repo.name))
          .sort((a: Repository, b: Repository) => 
            (repoConfig[a.name].order || 999) - 
            (repoConfig[b.name].order || 999)
          )

        // Fetch languages for each repo
        const reposWithLanguages = await Promise.all(
          filteredRepos.map(async (repo: Repository) => {
            try {
              const langRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`)
              const languages = await langRes.json()
              // If the response has a 'message' property, it's an error
              if (languages && typeof languages === 'object' && 'message' in languages) {
                return { ...repo, languages: {} }
              }
              return { ...repo, languages }
            } catch (e) {
              return { ...repo, languages: {} }
            }
          })
        )
        
        setRepos(reposWithLanguages)
      } catch (error: any) {
        setError(error.message || 'An error occurred while loading projects.')
        console.error('Error fetching repositories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [repoConfig, onRateLimit])

  if (loading) {
    return <div className="text-center">Loading software...</div>
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
              {repoConfig[repo.name]?.libraries?.map((library) => (
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
              {repoConfig[repo.name]?.customLinks?.map((link, index) => (
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