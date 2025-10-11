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
  }, [pdfUrl])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setPdfError(true)
    setIsLoading(false)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${title}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewExternal = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer')
  }

  if (pdfError) {
    return (
      <div className={`border rounded-lg bg-slate-50 dark:bg-slate-800 p-8 ${className}`}>
        <Alert className="mb-4">
          <FileText className="h-4 w-4" />
          <AlertDescription>
            PDF preview is not available in this browser. Please use the buttons below to view or download the resume.
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
    <div className={`border rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading PDF...
          </div>
        </div>
      )}
      
      {/* Simple iframe with PDF - this was working before */}
      <iframe
        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        className="w-full h-[800px] border-0"
        title={title}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        loading="lazy"
      />
    </div>
  )
}
