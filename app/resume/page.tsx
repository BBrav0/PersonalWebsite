"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, ExternalLink, RefreshCw, ArrowLeft, Menu, X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { PDFViewer } from "@/components/pdf-viewer"
import Link from "next/link"

interface ResumeData {
  pdfUrl: string
  lastModified?: string
  etag?: string
  timestamp: string
  sha?: string
  size?: number
  downloadUrl?: string
  updated?: boolean
  cached?: boolean
  cacheAge?: number
  stale?: boolean
  error?: string
}

export default function ResumePage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const fetchResumeData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/resume-image', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch resume data: ${response.status}`)
      }

      const data = await response.json()
      setResumeData(data)
      setLastChecked(new Date().toISOString())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resume data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumeData()
  }, [])

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

  const handleDownload = () => {
    if (resumeData?.downloadUrl) {
      const link = document.createElement('a')
      link.href = resumeData.downloadUrl
      link.download = 'Benjamin_Bravo_Resume.pdf'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleViewExternal = () => {
    if (resumeData?.downloadUrl) {
      window.open(resumeData.downloadUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#software", label: "Software" },
    { href: "/#projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/#contact", label: "Contact" },
  ]

  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-glow-pulse animation-delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-strong border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <Link href="/" className="text-xl font-bold tracking-tight">
                <span className="gradient-text">Ben Bravo</span>
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-strong border-t border-border/50 animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Resume Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">Resume</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              View my professional resume with up-to-date information about my experience, skills, and education.
            </p>
          </div>

          <div className="max-w-5xl mx-auto rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-border/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Benjamin Bravo - Resume</h2>
                    <p className="text-sm text-muted-foreground">
                      Computer Science Student & Software Developer
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {resumeData?.lastModified && (
                    <Badge variant="outline" className="text-xs font-normal">
                      Updated {formatDate(resumeData.lastModified)}
                    </Badge>
                  )}
                  {resumeData?.updated && (
                    <Badge className="text-xs font-normal bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      New Update
                    </Badge>
                  )}
                  {resumeData?.cached && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      Cached
                    </Badge>
                  )}
                  {resumeData?.stale && (
                    <Badge variant="destructive" className="text-xs font-normal">
                      Stale Data
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchResumeData}
                    disabled={loading}
                    className="ml-auto"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-96 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-destructive mb-4">
                    <FileText className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-lg font-semibold">Failed to load resume</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                  <Button onClick={fetchResumeData} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : resumeData ? (
                <div className="space-y-6">
                  {/* PDF Viewer */}
                  <PDFViewer 
                    pdfUrl={resumeData.pdfUrl}
                    title="Benjamin Bravo Resume"
                    className="w-full"
                  />

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleDownload} className="flex items-center gap-2 group">
                      <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
                      Download PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleViewExternal}
                      className="flex items-center gap-2 group"
                    >
                      <ExternalLink className="w-4 h-4 transition-transform group-hover:scale-110" />
                      View in New Tab
                    </Button>
                  </div>

                  {/* Status Info */}
                  <div className="text-center text-xs text-muted-foreground space-y-1">
                    {lastChecked && (
                      <div>Last checked: {formatDate(lastChecked)}</div>
                    )}
                    {resumeData?.cacheAge !== undefined && (
                      <div>Cache age: {resumeData.cacheAge}s</div>
                    )}
                    {resumeData?.size && (
                      <div>File size: {(resumeData.size / 1024).toFixed(1)} KB</div>
                    )}
                    {resumeData?.stale && resumeData?.error && (
                      <div className="text-amber-500 dark:text-amber-400">
                        ⚠️ {resumeData.error}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ben Bravo
        </div>
      </footer>
    </div>
  )
}
