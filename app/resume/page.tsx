"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, ExternalLink, RefreshCw, ArrowLeft } from "lucide-react"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="text-xl font-bold text-slate-900 dark:text-white">Ben Bravo</div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/#software"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Software
              </Link>
              <Link
                href="/#projects"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/#contact"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Resume Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Resume</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              View my professional resume with up-to-date information about my experience, skills, and education.
            </p>
          </div>

          <Card className="max-w-5xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <CardTitle>Benjamin Bravo - Resume</CardTitle>
                    <CardDescription>
                      Computer Science Student & Software Developer
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {resumeData?.lastModified && (
                    <Badge variant="outline" className="text-xs">
                      Updated {formatDate(resumeData.lastModified)}
                    </Badge>
                  )}
                  {resumeData?.updated && (
                    <Badge variant="default" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      New Update
                    </Badge>
                  )}
                  {resumeData?.cached && (
                    <Badge variant="secondary" className="text-xs">
                      Cached
                    </Badge>
                  )}
                  {resumeData?.stale && (
                    <Badge variant="destructive" className="text-xs">
                      Stale Data
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchResumeData}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                  <div className="text-red-500 mb-4">
                    <FileText className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-lg font-semibold">Failed to load resume</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{error}</p>
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
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={handleDownload} className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleViewExternal}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View in New Tab
                    </Button>
                  </div>

                  {/* Status Info */}
                  <div className="text-center text-sm text-slate-500 dark:text-slate-400 space-y-1">
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
                      <div className="text-amber-600 dark:text-amber-400">
                        ⚠️ {resumeData.error}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
        </div>
      </footer>
    </div>
  )
}
