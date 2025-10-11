"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Download, ExternalLink, RefreshCw } from "lucide-react"

interface PDFViewerProps {
  pdfUrl: string
  title: string
  className?: string
}

export function PDFViewer({ pdfUrl, title, className = "" }: PDFViewerProps) {
  const [pdfError, setPdfError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setPdfError(false)
    setIsLoading(true)
    
    // Set a timeout to stop loading after 3 seconds
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    
    return () => clearTimeout(timeout)
  }, [pdfUrl])

  const handleIframeLoad = () => {
    // Add a small delay to ensure content is fully loaded
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const handleIframeError = () => {
    setPdfError(true)
    setIsLoading(false)
  }

  const handleObjectLoad = () => {
    setIsLoading(false)
  }

  const handleObjectError = () => {
    setPdfError(true)
    setIsLoading(false)
  }

  const handleDownload = () => {
    // Use the original GitHub URL for download to avoid issues
    const downloadUrl = 'https://github.com/BBrav0/Resume-Building/raw/main/Benjamin%20Bravo%20Resume.pdf'
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${title}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewExternal = () => {
    // Use the original GitHub URL for external viewing
    const viewUrl = 'https://github.com/BBrav0/Resume-Building/raw/main/Benjamin%20Bravo%20Resume.pdf'
    window.open(viewUrl, '_blank', 'noopener,noreferrer')
  }

  if (pdfError) {
    return (
      <div className={`border rounded-lg bg-slate-50 dark:bg-slate-800 p-8 ${className}`}>
        <Alert className="mb-4">
          <FileText className="h-4 w-4" />
          <AlertDescription>
            PDF preview is not available. Please use the buttons below to view or download the resume.
          </AlertDescription>
        </Alert>
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
      </div>
    )
  }

  return (
    <div className={`border rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 relative ${className}`} data-pdf-container>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading PDF...
          </div>
        </div>
      )}
      
      {/* Use Google Docs viewer to prevent downloads and ensure proper display */}
      <iframe
        src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
        className="w-full h-[800px] border-0"
        title={title}
        onLoad={handleIframeLoad}
        onError={() => {
          // If Google Docs fails, try direct PDF
          const iframe = document.querySelector(`iframe[title="${title}"]`) as HTMLIFrameElement
          if (iframe) {
            iframe.src = pdfUrl
          }
        }}
        loading="lazy"
        onLoadStart={() => {
          // Start a timer to stop loading after 2 seconds regardless
          setTimeout(() => {
            setIsLoading(false)
          }, 2000)
        }}
      />
    </div>
  )
}
