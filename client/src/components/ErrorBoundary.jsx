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
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        if (this.props.onReset) {
            this.props.onReset();
        } else {
            window.location.href = '/';
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center px-4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E6D5C3] text-center max-w-md w-full">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-serif text-[#630D16] mb-2">
                            Something Went Wrong
                        </h2>
                        <p className="text-[#8B4513] mb-6">
                            We encountered an unexpected error. Don't worry, your cart and orders are safe.
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-4 text-left">
                                <summary className="text-xs text-[#8B4513]/60 cursor-pointer">Error Details</summary>
                                <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-32">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                        <button
                            onClick={this.handleReset}
                            className="w-full bg-[#630D16] hover:bg-[#4A0A10] text-white font-medium py-3 rounded-xl transition-all"
                        >
                            Return to Homepage
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
