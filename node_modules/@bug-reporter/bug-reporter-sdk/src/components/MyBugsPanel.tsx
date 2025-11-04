'use client';

import { useState, useEffect } from 'react';
import { useBugReporter } from '../hooks/useBugReporter';
import type { BugReport } from '@bug-reporter/shared';

// Inline styles
const styles = {
  container: {
    padding: '1.5rem',
  },
  header: {
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    margin: '0 0 0.5rem 0',
  },
  description: {
    color: '#6b7280',
    fontSize: '0.875rem',
    margin: 0,
  },
  loading: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#6b7280',
  },
  error: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#dc2626',
  },
  empty: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#6b7280',
  },
  bugCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '0.75rem',
  },
  bugHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  bugId: {
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  badgeBase: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  bugDescription: {
    fontSize: '0.875rem',
    color: '#374151',
    marginBottom: '0.5rem',
    margin: '0 0 0.5rem 0',
  },
  bugFooter: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: 0,
  },
};

const getBadgeStyle = (status: string) => ({
  ...styles.badgeBase,
  backgroundColor:
    status === 'resolved' ? '#d1fae5' :
    status === 'in_progress' ? '#fef3c7' :
    status === 'new' ? '#dbeafe' :
    '#f3f4f6',
  color:
    status === 'resolved' ? '#065f46' :
    status === 'in_progress' ? '#92400e' :
    status === 'new' ? '#1e40af' :
    '#374151',
});

export function MyBugsPanel() {
  const { apiClient, config } = useBugReporter();
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBugs() {
      if (!apiClient) {
        setError('Bug Reporter not initialized');
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiClient.getMyBugReports();
        setBugs(data.bug_reports);
        setError(null);
      } catch (err) {
        console.error('[BugReporter SDK] Failed to fetch bugs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load bug reports');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBugs();
  }, [apiClient]);

  if (!config.enabled) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Bug Reports</h1>
        <p style={styles.description}>
          Track your submitted bug reports and their status
        </p>
      </div>

      {isLoading && (
        <div style={styles.loading}>Loading your bug reports...</div>
      )}

      {error && (
        <div style={styles.error}>Error: {error}</div>
      )}

      {!isLoading && !error && bugs.length === 0 && (
        <div style={styles.empty}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>🐛</p>
          <p style={{ margin: '0 0 0.25rem 0' }}>No bug reports yet</p>
          <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Found a bug? Click the bug button to report it!
          </p>
        </div>
      )}

      {!isLoading && !error && bugs.length > 0 && (
        <div>
          {bugs.map((bug) => (
            <div key={bug.id} style={styles.bugCard}>
              <div style={styles.bugHeader}>
                <span style={styles.bugId}>#{bug.id.substring(0, 8)}</span>
                <span style={getBadgeStyle(bug.status)}>
                  {bug.status.replace('_', ' ')}
                </span>
              </div>
              <p style={styles.bugDescription}>
                {bug.description.length > 150
                  ? `${bug.description.substring(0, 150)}...`
                  : bug.description}
              </p>
              <div style={styles.bugFooter}>
                Reported {new Date(bug.created_at).toLocaleDateString()} •{' '}
                {bug.page_url}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
