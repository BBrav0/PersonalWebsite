import { NextRequest, NextResponse } from 'next/server'

const RESUME_PDF_URL = 'https://github.com/BBrav0/Resume-Building/raw/main/Benjamin%20Bravo%20Resume.pdf'

export async function GET(request: NextRequest) {
  try {
    // Fetch the PDF from GitHub
    const pdfResponse = await fetch(RESUME_PDF_URL, {
      headers: {
        'Accept': 'application/pdf',
        'User-Agent': 'Mozilla/5.0 (compatible; Resume-Website/1.0)',
      },
    })

    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`)
    }

    const pdfBuffer = await pdfResponse.arrayBuffer()
    const lastModified = pdfResponse.headers.get('last-modified')
    const etag = pdfResponse.headers.get('etag')

    // Return the PDF directly with proper headers for inline viewing
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
        'Content-Disposition': 'inline', // Force inline viewing, not download
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        ...(lastModified && { 'Last-Modified': lastModified }),
        ...(etag && { 'ETag': etag }),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('Error serving PDF:', error)
    return NextResponse.json(
      { error: 'Failed to serve PDF' },
      { status: 500 }
    )
  }
}
