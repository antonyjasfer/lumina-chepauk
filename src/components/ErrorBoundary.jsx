import React from 'react';

/**
 * ErrorBoundary — React Error Boundary component.
 * Catches runtime errors in child components and displays a user-friendly
 * fallback UI instead of crashing the entire application (white screen).
 * 
 * @security Prevents exposure of stack traces to end users.
 * @accessibility Provides clear error messaging with recovery action.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message || 'An unexpected error occurred.' };
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging (safe — only console, not exposed to users)
    console.error('[Lumina ErrorBoundary] Caught error:', error);
    console.error('[Lumina ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #051624 0%, #0a1f33 100%)',
            color: '#ffffff',
            fontFamily: "'Inter', sans-serif",
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(13, 40, 63, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 75, 75, 0.3)',
              borderRadius: '16px',
              padding: '48px',
              maxWidth: '480px',
              boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <h1
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.5rem',
                color: '#fcd500',
                marginBottom: '12px',
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.9rem',
                marginBottom: '24px',
                lineHeight: '1.6',
              }}
            >
              Lumina encountered an unexpected issue. This has been logged and
              won't affect your experience going forward.
            </p>
            <button
              onClick={this.handleReload}
              aria-label="Reload the application"
              style={{
                padding: '12px 32px',
                fontSize: '1rem',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '700',
                background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                color: '#0f172a',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              🔄 Reload Lumina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
