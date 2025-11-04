# 🐛 Bug Reporter Demo App

A simple React + Vite demo application to test the Centralized Bug Reporter SDK integration.

## Prerequisites

Before running this demo, make sure you have:

1. **Platform running**: The main platform should be running on `http://localhost:3000`
   ```bash
   # In the main project root
   cd platforms
   npm run dev
   ```

2. **User account**: You should have an account (admin@gmail.com is already set up)

3. **Organization & App**:
   - Organization: "Test Organization" (slug: test-org)
   - Application: "boobal" (already registered)
   - API Key: `br_NuIf5ghx-kA-C9EKsxul-wANVmC-z8jS`

## Quick Start

### 1. Install Dependencies (if not already done)

```bash
npm install
```

### 2. Run the Demo App

```bash
npm run dev
```

The app will start on `http://localhost:5173` (or another port if 5173 is busy)

### 3. Test Bug Reporting

1. Open the demo app in your browser
2. Look for the floating 🐛 bug button in the bottom-right corner
3. Click it to open the bug reporter modal
4. Fill in the bug details:
   - **Title**: e.g., "Test Bug Report"
   - **Description**: Describe the issue
   - **Priority**: Select low, medium, high, or critical
5. The screenshot is automatically captured!
6. Click "Submit Bug Report"
7. You'll see a success toast notification

### 4. View Bugs in the Platform

1. Go to `http://localhost:3000` (main platform)
2. Log in with `admin@gmail.com`
3. Navigate to your organization dashboard
4. Go to "Bug Reports" section
5. You should see the bug you just reported!

## Features to Test

### 1. Counter Button
- Click the "Counter" button to increment the count
- Take a screenshot while the counter is at different values

### 2. Trigger Error Button
- Click "Trigger Error" to test error reporting
- Note: You'll need error boundary handling in production apps

### 3. My Bugs Panel
- Click "Show My Bugs" to see all bugs reported by the demo user
- This panel fetches bugs from the platform API

### 4. Floating Bug Button
- Always visible in bottom-right corner
- Opens bug reporting modal
- Automatically captures screenshot
- Collects system information

## Configuration

The demo app is pre-configured with:

```typescript
apiKey: "br_NuIf5ghx-kA-C9EKsxul-wANVmC-z8jS"
apiUrl: "http://localhost:3000"
userContext: {
  userId: 'demo-user-123',
  userName: 'Demo User',
  userEmail: 'demo@example.com'
}
```

## Troubleshooting

### Bug not appearing in platform

1. Check that the platform is running on `http://localhost:3000`
2. Verify you're logged in with the correct account
3. Make sure you're viewing the correct organization (Test Organization)
4. Check the browser console for any errors
5. Verify the API key is correct

### SDK not loading

1. Make sure you ran `npm install` in the demo-app folder
2. Check that the SDK package is built
3. Rebuild the SDK if needed: `cd ../packages/bug-reporter-sdk && npm run build`

### CORS errors

The platform should already have CORS configured for localhost. If you see CORS errors, check that the platform is running.

## Tech Stack

- **React 19** - UI framework
- **TypeScript 5** - Type safety
- **Vite** - Build tool & dev server
- **Bug Reporter SDK** - Bug reporting integration

## Next Steps

After testing the demo:

1. Integrate the SDK into your own application
2. Configure your own API key from the platform
3. Customize the user context with real user data
4. Add error boundaries for better error handling
