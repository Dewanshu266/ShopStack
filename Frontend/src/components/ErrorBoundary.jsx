import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
    // console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <div style={{ margin: '12px 0' }}>{this.state.error?.message || String(this.state.error)}</div>
          <a href="/" style={{ color: '#3366cc', textDecoration: 'underline' }}>Go back to Home</a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
