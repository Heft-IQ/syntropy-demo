# Syntropy Demo

A Next.js demo application showcasing Syntropy's enterprise intelligence layer with voice-driven metric definition, architecture visualization, and enterprise dashboard features.

## Features

- **Architecture Visualization**: Interactive system architecture diagram with flow simulation
- **Onboarding Wizard**: Multi-step onboarding flow for connecting data sources
- **Voice Architect**: AI-powered voice interface for defining and revising business metrics
- **Enterprise Dashboard**: Comprehensive dashboard for managing semantic rules and audit logs
- **Impact Review**: Simulation and review system for metric changes

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd syntropy-demo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
syntropy-demo/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx             # Main app entry point
│   └── globals.css          # Global styles with Tailwind
├── components/
│   ├── architecture/        # Architecture visualization
│   ├── onboarding/          # Onboarding wizard
│   ├── voice-architect/     # Voice architect modal
│   ├── dashboard/           # Enterprise dashboard
│   └── ui/                  # Shared UI components
├── lib/
│   └── data.ts              # Mock data and constants
├── types/
│   └── index.ts             # TypeScript type definitions
└── ...
```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project or create a new one.

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository.

2. Import the project in [Vercel Dashboard](https://vercel.com/dashboard).

3. Vercel will automatically detect Next.js and configure the build settings.

4. Click "Deploy" to deploy your application.

### Option 3: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).

2. Click "Add New Project".

3. Import your Git repository or upload the project folder.

4. Vercel will automatically configure the build settings for Next.js.

5. Click "Deploy".

## Build for Production

To create an optimized production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

To start the production server locally:

```bash
npm start
# or
yarn start
# or
pnpm start
```

## Environment Variables

This demo application doesn't require any environment variables. For production use, you may want to add:

- API keys for external services
- Database connection strings
- Authentication configuration

Create a `.env.local` file in the root directory for local development.

## Customization

### Styling

The application uses Tailwind CSS v4. Customize styles in:
- `app/globals.css` - Global styles and custom animations
- Component files - Component-specific Tailwind classes

### Mock Data

Update mock data in `lib/data.ts`:
- `SEEDED_METRICS` - Initial metrics data
- `SEEDED_AUDIT_LOG` - Audit log entries
- `SIMULATION_DATA` - Simulation data for impact review

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This is a demo application for showcase purposes.

## Support

For issues or questions, please refer to the Next.js documentation or Vercel deployment guides.
