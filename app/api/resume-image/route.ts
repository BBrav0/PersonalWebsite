import { NextRequest, NextResponse } from 'next/server'

const RESUME_PDF_URL = 'https://github.com/BBrav0/Resume-Building/raw/main/Benjamin%20Bravo%20Resume.pdf'
const GITHUB_API_URL = 'https://api.github.com/repos/BBrav0/Resume-Building/contents/Benjamin%20Bravo%20Resume.pdf'

// Cache for storing resume metadata
let resumeCache: {
  data: any
  timestamp: number
  etag?: string
  lastModified?: string
} | null = null

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const now = Date.now()
    
    // Check if we have valid cached data
    if (resumeCache && (now - resumeCache.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        ...resumeCache.data,
        cached: true,
        cacheAge: Math.floor((now - resumeCache.timestamp) / 1000)
      }, {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 minutes
          ...(resumeCache.etag && { 'ETag': resumeCache.etag }),
          ...(resumeCache.lastModified && { 'Last-Modified': resumeCache.lastModified }),
        },
      })
    }

    // Check for cache headers from client
    const ifModifiedSince = request.headers.get('if-modified-since')
    const ifNoneMatch = request.headers.get('if-none-match')
    
    // First, check GitHub API for file metadata
    const githubResponse = await fetch(GITHUB_API_URL, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Mozilla/5.0 (compatible; Resume-Website/1.0)',
        ...(ifModifiedSince && { 'If-Modified-Since': ifModifiedSince }),
        ...(ifNoneMatch && { 'If-None-Match': ifNoneMatch }),
      },
    })

    if (githubResponse.status === 304) {
      return new NextResponse(null, { status: 304 })
    }

    if (!githubResponse.ok) {
      throw new Error(`Failed to fetch GitHub metadata: ${githubResponse.status}`)
    }

    const githubData = await githubResponse.json()
    const lastModified = githubData.commit?.committer?.date
    const etag = githubResponse.headers.get('etag')
    const sha = githubData.sha

    // Check if the file has been updated
    if (resumeCache && resumeCache.etag === etag) {
      // File hasn't changed, return cached data
      resumeCache.timestamp = now
      return NextResponse.json({
        ...resumeCache.data,
        cached: true,
        cacheAge: 0
      }, {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300',
          ...(etag && { 'ETag': etag }),
          ...(lastModified && { 'Last-Modified': lastModified }),
        },
      })
    }

    // Fetch the actual PDF to verify it's accessible
    const pdfResponse = await fetch(RESUME_PDF_URL, {
      headers: {
        'Accept': 'application/pdf',
        'User-Agent': 'Mozilla/5.0 (compatible; Resume-Website/1.0)',
      },
    })

    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`)
    }

    // Get the PDF buffer for serving
    const pdfBuffer = await pdfResponse.arrayBuffer()

    // Prepare response data - use GitHub URL directly for iframe viewing
    const responseData = {
      pdfUrl: RESUME_PDF_URL, // Use GitHub URL directly
      lastModified,
      etag,
      sha,
      timestamp: new Date().toISOString(),
      size: githubData.size,
      downloadUrl: githubData.download_url,
      updated: true
    }

    // Update cache
    resumeCache = {
      data: responseData,
      timestamp: now,
      etag: etag ?? undefined,
      lastModified
    }

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 minutes
        ...(etag && { 'ETag': etag }),
        ...(lastModified && { 'Last-Modified': lastModified }),
      },
    })

  } catch (error) {
    console.error('Error fetching resume data:', error)
    
    // Return cached data if available, even if stale
    if (resumeCache) {
      return NextResponse.json({
        ...resumeCache.data,
        cached: true,
        stale: true,
        error: 'Using cached data due to fetch error'
      }, {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60', // 1 minute for stale data
        },
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch resume data' },
      { status: 500 }
    )
  }
}
