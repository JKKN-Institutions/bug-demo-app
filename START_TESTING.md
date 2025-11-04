# Quick Start Guide for Testing

## ✅ TypeScript Setup Complete

All TypeScript errors are now resolved. The demo app is ready to run.

## 🚀 How to Start Testing

### Option 1: Manual Start (Recommended)

Open **TWO terminal windows**:

**Terminal 1 - Platform Server:**
```bash
cd platforms
npm run dev
```
Wait for message: "Local: http://localhost:3000"

**Terminal 2 - Demo App:**
```bash
cd demo-app
npm run dev
```
Wait for message: "Local: http://localhost:5173"

### Option 2: Quick Check

Just start the demo app to verify it compiles:
```bash
cd demo-app
npm run dev
```

## 🧪 Testing Steps

1. **Open demo app** - http://localhost:5173
2. **Verify UI loads** - Should see "Bug Reporter Demo App" 
3. **Check for 🐛 button** - Bottom-right corner floating button
4. **Click bug button** - Opens modal form
5. **Fill form:**
   - Title: "Test Bug"
   - Description: "Testing the integration"
   - Priority: Select any
6. **Submit** - Should see success toast
7. **Check platform** - Go to http://localhost:3000 and login
8. **View bugs** - Navigate to Bug Reports section

## ✅ What's Fixed

- ✅ html2canvas dependency installed
- ✅ TypeScript path mappings configured
- ✅ Package exports set up correctly
- ✅ Vite config optimized
- ✅ All TypeScript errors resolved

## 🔍 Verify Setup

Check if everything is ready:
```bash
cd demo-app
npm list @bug-reporter/bug-reporter-sdk
npm list html2canvas
npm list react-hot-toast
npx tsc --noEmit
```

All should show installed packages and no TypeScript errors.

## 🐛 Troubleshooting

### If you see module not found errors:
```bash
cd demo-app
rm -rf node_modules/.vite
npm run dev
```

### If TypeScript still shows errors in VS Code:
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "TypeScript: Restart TS Server"
3. Press Enter
4. Wait 10 seconds for TS server to restart

### If the platform is not running:
```bash
cd platforms
npm run dev
```

## 📝 Test Checklist

- [ ] Demo app starts without errors
- [ ] Can see the UI
- [ ] Floating bug button visible
- [ ] Can click bug button
- [ ] Modal opens with form
- [ ] Can fill and submit form
- [ ] Success toast appears
- [ ] Bug appears in platform dashboard

Happy testing! 🎉
