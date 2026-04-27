# Japan Trip Timeline Website

A beautiful timeline website for the Japan trip (May 12-17, 2026) with an email newsletter signup.

## Features

- **Interactive Timeline**: Visual representation of the trip itinerary
- **Newsletter Signup**: Subscribe to stay updated on trip stories and updates
- **Responsive Design**: Works great on mobile and desktop
- **Modern Stack**: Built with Next.js 15, React 19, and Tailwind CSS

## Setup

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm i -g vercel
vercel
```

### Environment Variables

For production email integration, add:

```env
# Example for Mailchimp integration
MAILCHIMP_API_KEY=your_key
MAILCHIMP_LIST_ID=your_list_id
```

## Email Newsletter Integration

Currently, the newsletter endpoint stores subscribers in memory. To use a real service:

1. **Mailchimp**: Update `app/api/subscribe/route.ts` to use Mailchimp API
2. **SendGrid**: Integrate SendGrid for transactional emails
3. **Database**: Add a database (Supabase, Firebase, etc.) to persist subscribers

Example Mailchimp integration coming soon.

## Customization

- **Timeline Events**: Edit `components/Timeline.tsx`
- **Styling**: Modify `app/globals.css` and Tailwind config
- **Newsletter Copy**: Update `components/Newsletter.tsx`
