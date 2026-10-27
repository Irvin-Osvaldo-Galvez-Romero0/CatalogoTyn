import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Kiosk Error Boundary caught an exception:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 18, 22, 0.96)',
          color: '#FFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          zIndex: 99999
        }}>
          <h3>Hubo un inconveniente al cargar el componente</h3>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '9999px',
              background: '#00F5D4',
              color: '#042422',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Volver al Catálogo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
