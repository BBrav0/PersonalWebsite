import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hub-signature-256')
    
    // Verify webhook signature if secret is configured
    if (WEBHOOK_SECRET && signature) {
      const expectedSignature = `sha256=${crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(body)
        .digest('hex')}`
      
      if (signature !== expectedSignature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const payload = JSON.parse(body)
    
    // Check if this is a push to the main branch
    if (payload.ref === 'refs/heads/main' && payload.commits) {
      const resumeFileChanged = payload.commits.some((commit: any) =>
        commit.modified?.includes('Benjamin Bravo Resume.pdf') ||
        commit.added?.includes('Benjamin Bravo Resume.pdf')
      )

      if (resumeFileChanged) {
        // Clear the resume cache to force a fresh fetch
        // In a production environment, you might want to use a more sophisticated cache invalidation
        console.log('Resume PDF updated, cache should be invalidated')
        
        // You could also trigger a rebuild or send a notification here
        // For now, we'll just log the event
        return NextResponse.json({ 
          message: 'Resume update detected',
          timestamp: new Date().toISOString()
        })
      }
    }

    return NextResponse.json({ message: 'Webhook received' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'GitHub webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
