# KM Invoice App

A Next.js application for managing invoices.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kminvoice.git
cd kminvoice
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your environment variables:
```
# Add your environment variables here
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Starting Production Server

```bash
npm run start
# or
yarn start
```

## Deployment to Coolify

This application is configured to be deployed on a VPS running Coolify.

### Deployment Steps

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. In your Coolify dashboard:
   - Create a new service
   - Connect to your GitHub repository
   - Select Node.js as the runtime
   - Configure the build command: `npm run build`
   - Configure the start command: `npm run start`
   - Set the port to match your application (default: 3000)
   - Add any required environment variables

3. Deploy the application

## Project Structure

- `/app` - Next.js app directory with pages and API routes
- `/components` - Reusable React components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and shared code
- `/public` - Static assets
- `/styles` - Global styles

## Technologies Used

- Next.js 15.1.0
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- Shadcn UI
