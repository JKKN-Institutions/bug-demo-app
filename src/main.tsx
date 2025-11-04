import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BugReporterProvider } from '@bug-reporter/bug-reporter-sdk/src';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BugReporterProvider
      apiKey={import.meta.env.VITE_API_KEY || 'br_NuIf5ghx-kA-C9EKsxul-wANVmC-z8jS'}
      apiUrl={import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1/public'}
      userContext={{
        userId: import.meta.env.VITE_USER_ID || 'demo-user-123',
        name: import.meta.env.VITE_USER_NAME || 'Demo User',
        email: import.meta.env.VITE_USER_EMAIL || 'demo@example.com'
      }}
      debug={import.meta.env.VITE_DEBUG === 'true'}
    >
      <App />
    </BugReporterProvider>
  </StrictMode>
);
