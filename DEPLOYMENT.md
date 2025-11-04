# Demo App Deployment Guide

## Overview
This guide explains how to deploy the Bug Reporter Demo App to Vercel.

## Prerequisites
- Vercel account
- Node.js 18+ and npm
- Access to the main platform API (for API key)

## Build Configuration Fixed

### Issues Resolved
1. ✅ Package path issues - All `@bug-reporter/*` packages now reference local copies
2. ✅ TypeScript compilation errors - Fixed type-only imports
3. ✅ Build process - Compiles successfully with Vite
4. ✅ Vercel routing - Added `vercel.json` for SPA support

## Environment Variables

Before deployment, you need to set these environment variables in Vercel:

```bash
# Required
VITE_API_KEY=your-api-key-from-platform
VITE_API_URL=https://your-platform-url.com

# Optional (for demo purposes)
VITE_USER_ID=demo-user-123
VITE_USER_NAME=Demo User
VITE_USER_EMAIL=demo@example.com
VITE_DEBUG=false
```

### Getting Your API Key

1. Deploy the main platform first
2. Create an organization in the platform
3. Create an application in that organization
4. Generate an API key for the application
5. Copy the API key and use it as `VITE_API_KEY`

## Deployment Steps

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to demo-app directory
cd demo-app

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? bug-demo-app (or your choice)
# - Directory? ./
# - Override settings? No
```

### Option 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Select the `demo-app` directory as the root
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Install Command: `npm install`
8. Add environment variables (see above)
9. Click **Deploy**

### Option 3: Deploy from GitHub

1. Push your code to GitHub
2. Connect repository to Vercel
3. Set root directory to `demo-app`
4. Configure environment variables
5. Deploy

## Vercel Configuration

The `vercel.json` file is already configured with:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that all routes are handled by the SPA.

## Post-Deployment

### Verify Deployment

1. Visit your Vercel deployment URL
2. You should see the demo app homepage with:
   - Vite + React logos
   - "Bug Reporter Demo App" title
   - Counter button
   - Trigger Error button
   - Show/Hide My Bugs button
   - Floating 🐛 bug button in bottom-right corner

### Test Bug Reporting

1. Click the floating 🐛 button
2. Fill in bug title and description
3. Submit the bug
4. Check your platform dashboard to see the reported bug

### Common Issues

#### 404 Error on Refresh
**Fixed!** The `vercel.json` configuration now handles SPA routing correctly.

#### API Connection Errors
- Verify `VITE_API_URL` points to your deployed platform
- Verify `VITE_API_KEY` is correct
- Check CORS settings on your platform
- Check browser console for detailed errors

#### Build Failures
- Ensure all packages are installed: `npm install`
- Test build locally first: `npm run build`
- Check Node.js version (should be 18+)

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your values
# VITE_API_KEY=your-key
# VITE_API_URL=http://localhost:3000

# Start dev server
npm run dev

# Visit http://localhost:5173
```

## Build Output

The build process creates:
- `dist/index.html` - Main HTML file
- `dist/assets/` - JS and CSS bundles
- Total bundle size: ~420KB (117KB gzipped)

## Updating Deployment

```bash
# Make your changes
# Test locally: npm run build && npm run preview
# Then redeploy
vercel --prod
```

## Troubleshooting

### TypeScript Errors
All TypeScript errors have been fixed. If you encounter new ones:
- Run `npm run build` locally first
- Check for type import issues
- Ensure `verbatimModuleSyntax` compatibility

### Package Resolution
If you see module not found errors:
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Verify symlinks in `node_modules/@bug-reporter/`

### Environment Variables Not Working
- Prefix all variables with `VITE_`
- Rebuild after changing env vars
- Check Vercel dashboard for correct values

## Support

For issues:
1. Check browser console for errors
2. Check Vercel deployment logs
3. Verify API key and URL
4. Test API endpoint manually

## Summary

✅ Build process fixed
✅ Package dependencies resolved
✅ Vercel configuration added
✅ SPA routing configured
✅ Environment variables documented
✅ Deployment guide completed

The demo app is now ready for deployment!
