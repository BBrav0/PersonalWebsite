# Resume Section Setup

This document explains how the resume section works and how to set up automatic updates.

## Features

- **High-Quality PDF Display**: Your resume PDF is displayed in an embedded iframe for optimal viewing
- **Automatic Updates**: The system detects when your PDF is updated on GitHub
- **Caching**: Intelligent caching reduces API calls and improves performance
- **Download Options**: Users can download the PDF or view it in a new tab

## How It Works

### 1. PDF Source
The resume section pulls your PDF from:
```
https://github.com/BBrav0/Resume-Building/raw/main/Benjamin%20Bravo%20Resume.pdf
```

### 2. Update Detection
The system uses two methods to detect updates:

#### Method 1: GitHub API Polling
- Checks GitHub's API every 5 minutes for file changes
- Uses ETags and Last-Modified headers for efficient checking
- Caches responses to minimize API calls

#### Method 2: GitHub Webhook (Recommended)
- Set up a webhook to get instant notifications when the PDF is updated
- More efficient than polling
- Requires webhook configuration in your GitHub repository

## Setting Up Automatic Updates

### Option 1: GitHub Webhook (Recommended)

1. Go to your repository: `https://github.com/BBrav0/Resume-Building`
2. Navigate to Settings → Webhooks
3. Click "Add webhook"
4. Set the Payload URL to: `https://your-domain.com/api/github-webhook`
5. Set Content type to: `application/json`
6. Select "Just the push event"
7. Add a secret (optional but recommended)
8. Set the secret in your environment variables as `GITHUB_WEBHOOK_SECRET`

### Option 2: Manual Refresh
Users can click the "Refresh" button to manually check for updates.

## Environment Variables

Add these to your `.env.local` file:

```env
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
```

## API Endpoints

### `/api/resume-image`
- Returns resume metadata and PDF URL
- Handles caching and update detection
- Returns 304 Not Modified when appropriate

### `/api/github-webhook`
- Receives GitHub webhook notifications
- Validates webhook signatures
- Triggers cache invalidation

## Caching Strategy

- **Client-side**: 5-minute cache with manual refresh option
- **Server-side**: 5-minute cache with GitHub API integration
- **Stale-while-revalidate**: Falls back to cached data if GitHub API is unavailable

## Customization

### Changing the PDF Source
Update the `RESUME_PDF_URL` in `app/api/resume-image/route.ts`:

```typescript
const RESUME_PDF_URL = 'https://github.com/your-username/your-repo/raw/main/your-resume.pdf'
```

### Styling
The resume section uses Tailwind CSS classes. You can customize the appearance by modifying `components/resume-section.tsx`.

### Update Frequency
Change the `CACHE_DURATION` in `app/api/resume-image/route.ts`:

```typescript
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
```

## Troubleshooting

### PDF Not Loading
1. Check that the PDF URL is accessible
2. Verify the GitHub repository is public
3. Check browser console for errors

### Updates Not Detected
1. Ensure the webhook is properly configured
2. Check webhook delivery logs in GitHub
3. Verify the webhook secret matches your environment variable

### Performance Issues
1. The system uses intelligent caching to minimize API calls
2. Consider reducing the cache duration if updates need to be more immediate
3. Monitor GitHub API rate limits

## Security Considerations

- Webhook signatures are verified if a secret is provided
- The PDF URL is validated before serving
- CORS headers are properly set
- No sensitive data is exposed in the API responses
