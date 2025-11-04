# Vercel Deployment Guide - Demo App

## Environment Variables for Production

When deploying to Vercel, you need to set the following environment variables:

### Required Variables

**IMPORTANT:** `VITE_API_URL` should be the BASE URL only (without `/api/v1/public`). The SDK automatically appends the API path.

```bash
# Bug Reporter API Configuration
VITE_API_KEY=br_NuIf5ghx-kA-C9EKsxul-wANVmC-z8jS
VITE_API_URL=https://jkkn-centralized-bug-reporter.vercel.app

# User Context (Demo)
VITE_USER_ID=demo-user-123
VITE_USER_NAME=Demo User
VITE_USER_EMAIL=demo@example.com

# Debug Mode (set to false for production)
VITE_DEBUG=false
```

## How to Set Environment Variables in Vercel

### Option 1: Via Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - Variable Name: `VITE_API_KEY`
   - Value: `br_NuIf5ghx-kA-C9EKsxul-wANVmC-z8jS`
   - Environment: Select **Production**, **Preview**, and **Development**
4. Repeat for all variables above
5. **Redeploy** your application

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Set environment variables
vercel env add VITE_API_KEY production
# Enter: br_NuIf5ghx-kA-C9EKsxul-wANVmC-z8jS

vercel env add VITE_API_URL production
# Enter: https://jkkn-centralized-bug-reporter.vercel.app

vercel env add VITE_USER_ID production
# Enter: demo-user-123

vercel env add VITE_USER_NAME production
# Enter: Demo User

vercel env add VITE_USER_EMAIL production
# Enter: demo@example.com

vercel env add VITE_DEBUG production
# Enter: false

# Redeploy
vercel --prod
```

## Important Notes

### API URL Structure
- ✅ **Correct**: `https://jkkn-centralized-bug-reporter.vercel.app` (BASE URL only)
- ❌ **Incorrect**: `https://jkkn-centralized-bug-reporter.vercel.app/api/v1/public` (SDK appends this automatically - will cause duplicate path)
- ❌ **Incorrect**: `http://localhost:3000` (local only, not for production)

**Why?** The SDK automatically appends `/api/v1/public/bug-reports` to the base URL. If you include `/api/v1/public` in the URL, it will duplicate to `/api/v1/public/api/v1/public/bug-reports` causing a 405 error.

### API Key
- Get your API key from the platform at: https://jkkn-centralized-bug-reporter.vercel.app
- Navigate to: **Organization** → **Applications** → **Your App** → **API Key**
- The key format should be: `br_xxxxxxxxxxxxxxxxxxxxx`

### CORS Issues
If you encounter CORS errors:
1. Verify the main platform has CORS headers configured (already done)
2. Make sure `VITE_API_URL` includes the full path: `/api/v1/public`
3. Check browser console for exact error messages
4. Wait 2-5 minutes after deploying for changes to propagate

## Deployment Steps

1. **Set Environment Variables** (as shown above)
2. **Push to GitHub** (Vercel auto-deploys on push)
   ```bash
   git add .
   git commit -m "Update environment configuration for production"
   git push origin master
   ```
3. **Wait for Deployment** (2-3 minutes)
4. **Test** - Visit your Vercel URL and try submitting a bug report

## Verify Deployment

After deploying, verify:
- ✅ Demo app loads without errors
- ✅ Bug Reporter widget appears (bottom-right corner)
- ✅ Can submit bug reports successfully
- ✅ Screenshots are captured
- ✅ Console logs are included
- ✅ No CORS errors in browser console

## Troubleshooting

### Issue: "API Key validation failed"
- Check that `VITE_API_KEY` is set correctly in Vercel
- Verify the API key is active in the platform

### Issue: CORS errors or 405 errors
- Ensure `VITE_API_URL` is the BASE URL only (no `/api/v1/public`)
- Correct: `https://jkkn-centralized-bug-reporter.vercel.app`
- Incorrect: `https://jkkn-centralized-bug-reporter.vercel.app/api/v1/public`
- Wait for platform deployment to complete (CORS headers were just added)
- Check browser network tab for actual request URL - should be `/api/v1/public/bug-reports` not `/api/v1/public/api/v1/public/bug-reports`

### Issue: Environment variables not working
- After setting env vars in Vercel, you MUST redeploy
- Click **"Deployments"** → **"..."** → **"Redeploy"**
- Or push a new commit to trigger auto-deployment

## Contact

For issues or questions:
- Platform: https://jkkn-centralized-bug-reporter.vercel.app
- Email: boobalan@jkkn.ac.in
