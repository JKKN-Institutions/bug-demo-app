# Bug Reporter SDK

React SDK for integrating centralized bug reporting into your applications.

## Installation

```bash
npm install @bug-reporter/bug-reporter-sdk
```

## Setup

### 1. Get your API key

Register your application at the centralized platform to get an API key.

### 2. Add to your app

```tsx
import { BugReporterProvider } from '@bug-reporter/bug-reporter-sdk';

function App() {
  return (
    <BugReporterProvider
      apiKey="app_your_api_key_here"
      apiUrl="https://bugs.yourplatform.com"
    >
      <YourApp />
    </BugReporterProvider>
  );
}
```

The floating bug button will automatically appear.

### 3. Optional: Add bug dashboard

```tsx
import { MyBugsPanel } from '@bug-reporter/bug-reporter-sdk';

function MyBugsPage() {
  return <MyBugsPanel />;
}
```

## Features

- 🐛 Floating bug reporter button
- 📸 Automatic screenshot capture
- 📊 User bug dashboard
- 🔒 Secure API key authentication
- ⚡ Lightweight and performant

## Props

### BugReporterProvider

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `apiKey` | string | Yes | Your application API key |
| `apiUrl` | string | Yes | Platform API URL |
| `enabled` | boolean | No | Enable/disable bug reporting (default: true) |
| `debug` | boolean | No | Enable debug logging (default: false) |
| `userContext` | object | No | User information for bug reports |

### MyBugsPanel

No props required - uses context from BugReporterProvider.

## License

MIT
