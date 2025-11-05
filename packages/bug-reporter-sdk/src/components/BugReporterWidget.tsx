'use client';

import { useState } from 'react';
import { Bug, Camera } from 'lucide-react';
import { captureScreenshot } from '../utils/screenshot';
import { useBugReporter } from '../hooks/useBugReporter';
import { consoleLogger } from '../utils/console-logger';
import toast from 'react-hot-toast';

// Simple inline styles (no Tailwind dependency for SDK)
const styles = {
  floatingButton: {
    position: 'fixed' as const,
    bottom: '1rem',
    right: '1rem',
    zIndex: 9999,
    width: '3.5rem',
    height: '3.5rem',
    borderRadius: '50%',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    transition: 'transform 0.2s',
  },
  modal: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '1rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    maxWidth: '28rem',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem',
    color: '#6b7280',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
    color: '#374151',
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  },
  submitButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

export function BugReporterWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('bug');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshot, setScreenshot] = useState<string>('');
  const { apiClient, config } = useBugReporter();

  const handleOpenWidget = async () => {
    setIsCapturing(true);
    try {
      const captured = await captureScreenshot();
      setScreenshot(captured);
      setIsOpen(true);
      toast.success('Screenshot captured!');
    } catch (error) {
      console.error('[BugReporter SDK] Screenshot failed:', error);
      setIsOpen(true);
      toast.error('Screenshot capture failed, but you can still report the bug');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSubmit = async () => {
    if (!apiClient) {
      toast.error('Bug Reporter not initialized');
      return;
    }

    if (!title || title.trim().length < 3) {
      toast.error('Please provide a title (minimum 3 characters)');
      return;
    }

    if (!description || description.trim().length < 10) {
      toast.error('Please provide at least 10 characters description');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get captured console logs
      const capturedLogs = consoleLogger.getLogs();

      const payload: any = {
        title: title.trim(),
        page_url: window.location.href,
        description: description.trim(),
        category: category,
        screenshot_data_url: screenshot,
        console_logs: capturedLogs,
        metadata: {
          userAgent: navigator.userAgent,
          screenResolution: `${screen.width}x${screen.height}`,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          timestamp: new Date().toISOString(),
          reporter_user_id: config.userContext?.userId,
        },
        // Include user context if provided
        reporter_email: config.userContext?.email,
        reporter_name: config.userContext?.name,
      };

      await apiClient.createBugReport(payload);

      toast.success('Bug report submitted successfully!');
      setTitle('');
      setDescription('');
      setCategory('bug');
      setScreenshot('');
      setIsOpen(false);
    } catch (error) {
      console.error('[BugReporter SDK] Submit failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit bug report');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!config.enabled) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpenWidget}
        disabled={isCapturing}
        style={{
          ...styles.floatingButton,
          ...(isCapturing ? { transform: 'scale(0.9)' } : {}),
        }}
        className="bug-reporter-sdk bug-reporter-widget"
        title="Report a Bug"
      >
        {isCapturing ? <Camera size={28} strokeWidth={2} /> : <Bug size={28} strokeWidth={2} />}
      </button>

      {/* Modal */}
      {isOpen && (
        <div style={styles.modal} className="bug-reporter-sdk" onClick={() => setIsOpen(false)}>
          <div style={styles.card} onClick={(e) => e.stopPropagation()}>
            <div style={styles.header}>
              <h2 style={styles.title}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bug size={24} strokeWidth={2} />
                  Report a Bug
                </span>
              </h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTitle('');
                  setDescription('');
                  setCategory('bug');
                  setScreenshot('');
                }}
                style={styles.closeButton}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={styles.label}>
                Bug Title <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                }}
              />
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                Minimum 3 characters required ({title.length}/3)
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={styles.label}>
                Category <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
              >
                <option value="bug">Bug / Functionality Issue</option>
                <option value="ui_design">UI/Design Issue</option>
                <option value="performance">Performance Issue</option>
                <option value="security">Security Issue</option>
                <option value="feature_request">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={styles.label}>
                Describe the issue <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What went wrong? Please provide details..."
                style={styles.textarea}
                rows={4}
              />
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                Minimum 10 characters required ({description.length}/10)
              </p>
            </div>

            {screenshot && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={styles.label}>
                  ✓ Screenshot captured
                </label>
                <img
                  src={screenshot}
                  alt="Screenshot"
                  style={{
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                  }}
                />
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || title.trim().length < 3 || description.trim().length < 10}
              style={{
                ...styles.submitButton,
                ...(isSubmitting || title.trim().length < 3 || description.trim().length < 10 ? styles.buttonDisabled : {}),
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
