'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

interface Repository {
  name: string
  description: string
  html_url: string
  homepage: string
  topics: string[]
  language: string
}

interface RepoConfig {
  order: number
  libraries?: string[]
}

// Configuration for which repositories to display
const REPO_CONFIG: Record<string, RepoConfig> = {
  'CoursePlanner': {
    order: 1,
    libraries: ['Tkinter']
  },
  'BlitzLoLLink': {
    order: 2,
    libraries: ['Windows Scripting']
  },
  'MidAirBlock': {
    order: 3,
    libraries: ['Bukkit', 'Minecraft Plugin']
  },
  'ArrowRide': {
    order: 4,
    libraries: ['Bukkit', 'Minecraft Plugin']
  }
}

export function GithubProjects() {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('https://api.github.com/users/BBrav0/repos')
        const data = await response.json()
        
        // Filter and sort repositories based on configuration
        const filteredRepos = data
          .filter((repo: Repository) => REPO_CONFIG.hasOwnProperty(repo.name))
          .sort((a: Repository, b: Repository) => 
            (REPO_CONFIG[a.name].order || 999) - 
            (REPO_CONFIG[b.name].order || 999)
          )
        
        setRepos(filteredRepos)
      } catch (error) {
        console.error('Error fetching repositories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [])

  if (loading) {
    return <div className="text-center">Loading projects...</div>
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.map((repo) => (
        <Card key={repo.name} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{repo.name}</CardTitle>
            <CardDescription>{repo.description || 'No description available'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {repo.language && (
                <Badge variant="default">{repo.language}</Badge>
              )}
              {REPO_CONFIG[repo.name]?.libraries?.map((library) => (
                <Badge key={library} variant="secondary">{library}</Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-1" />
                  GitHub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 