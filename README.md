
# PinoyHowTo AI - Passive Content Engine

A full-stack project built for passive income via SEO-optimized AI content focused on the Philippines.

## Features
- **AI Engine**: Uses Gemini 3 Pro/Flash to generate high-quality 800+ word guides.
- **SEO Ready**: Auto-generates meta tags and JSON-LD FAQ schemas.
- **Monetization**: Injects affiliate links (Shopee, Lazada, GCash) and Ad slots automatically.
- **Mobile First**: Clean Tailwind UI designed for PH mobile users.

## Quick Start
1. Add your Gemini API key to `.env` or Vercel environment variables as `API_KEY`.
2. Run `npm install` and `npm start`.
3. Go to the **/automation** page to trigger the first set of articles.

## Deployment on Vercel
1. Push this code to a GitHub Repository.
2. Connect the repo to Vercel.
3. Add `API_KEY` in Environment Variables.
4. Deployment will be live on `your-project.vercel.app`.

## Scheduling Automation (Passive Mode)
To truly make it passive, you can trigger the automation via a GitHub Action every morning:

1. Create `.github/workflows/daily-content.yml`:
```yaml
name: Generate Daily Content
on:
  schedule:
    - cron: '0 0 * * *' # Every day at midnight
  workflow_dispatch:

jobs:
  ping-automation:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger API
        run: |
          curl -X POST https://your-site.vercel.app/api/automation-endpoint \
          -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```
*Note: You will need to expose the automation logic as a Vercel Serverless Function (Express route) to support this curl command.*

## Connecting to a CMS (WordPress/Ghost)
In `services/gemini.ts`, instead of `saveArticle(article)` (which uses localStorage), you can replace it with a REST API call:

```ts
export const pushToWordPress = async (article: Article) => {
  await fetch('https://your-wp-site.com/wp-json/wp/v2/posts', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa('user:app-password'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: article.h1,
      content: article.content,
      status: 'publish',
      meta: {
        _yoast_wpseo_metadesc: article.metaDescription
      }
    })
  });
}
```

## Monetization Tips
- Update `constants.ts` with your actual affiliate tracking IDs.
- Use Google AdSense or Ezoic for the ad placeholders.
