# CollaBoard

A collaborative real-time whiteboard application.

## Description

CollaBoard enables multiple users to collaborate on a shared digital whiteboard in real-time. Users can draw, add text, and interact with the board simultaneously while seeing changes from other participants instantly.

## Features

- Real-time collaboration
- User authentication
- Organization management
- Responsive design

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Convex
- **Authentication**: Clerk
- **Styling**: Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Development

- `npm run dev` - Start development server
- `npx convex dev` - Start Convex backend
