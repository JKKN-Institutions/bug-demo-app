'use client';

import { useContext } from 'react';
import { BugReporterContext } from '../components/BugReporterProvider';

export function useBugReporter() {
  const context = useContext(BugReporterContext);

  if (!context) {
    throw new Error('useBugReporter must be used within BugReporterProvider');
  }

  return context;
}
