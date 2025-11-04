# Vercel Deployment Guide - Demo App

## Environment Variables for Production

When deploying to Vercel, you need to set the following environment variables:

### Required Variables

```bash
# Bug Reporter API Configuration
VITE_API_KEY=br_NuIf5ghx-kA-C9EKsxul-wANVmC-z8jS
VITE_API_URL=https://jkkn-centralized-bug-reporter.vercel.app/api/v1/public

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
# Enter: https://jkkn-centralized-bug-reporter.vercel.app/api/v1/public

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
- ✅ **Correct**: `https://jkkn-centralized-bug-reporter.vercel.app/api/v1/public`
- ❌ **Incorrect**: `https://jkkn-centralized-bug-reporter.vercel.app` (missing `/api/v1/public`)
- ❌ **Incorrect**: `http://localhost:3000` (local only)

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

### Issue: CORS errors
- Ensure `VITE_API_URL` includes `/api/v1/public` at the end
- Wait for platform deployment to complete (CORS headers were just added)
- Check browser network tab for actual request URL

### Issue: Environment variables not working
- After setting env vars in Vercel, you MUST redeploy
- Click **"Deployments"** → **"..."** → **"Redeploy"**
- Or push a new commit to trigger auto-deployment

## Contact

For issues or questions:
- Platform: https://jkkn-centralized-bug-reporter.vercel.app
- Email: boobalan@jkkn.ac.in
