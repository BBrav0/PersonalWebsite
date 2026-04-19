import { NextRequest, NextResponse } from 'next/server'

const RESUME_PDF_URL = 'https://github.com/BBrav0/Resume-Building/raw/main/Benjamin%20Bravo%20Resume.pdf'
const GITHUB_API_URL = 'https://api.github.com/repos/BBrav0/Resume-Building/contents/Benjamin%20Bravo%20Resume.pdf'

export async function GET(request: NextRequest) {
  try {
    // Check for cache headers from client
    const ifNoneMatch = request.headers.get('if-none-match')

    // Check GitHub API for file metadata
    const githubResponse = await fetch(GITHUB_API_URL, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Mozilla/5.0 (compatible; Resume-Website/1.0)',
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
    const etag = githubResponse.headers.get('etag') ?? undefined
    const sha = githubData.sha

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

    // Prepare response data - use GitHub URL directly for iframe viewing
    const responseData = {
      pdfUrl: RESUME_PDF_URL,
      lastModified,
      etag,
      sha,
      timestamp: new Date().toISOString(),
      size: githubData.size,
      downloadUrl: githubData.download_url,
      updated: true,
    }

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300',
        ...(etag && { 'ETag': etag }),
        ...(lastModified && { 'Last-Modified': lastModified }),
      },
    })

  } catch (error) {
    console.error('Error fetching resume data:', error)

    return NextResponse.json(
      { error: 'Failed to fetch resume data' },
      { status: 500 }
    )
  }
}
