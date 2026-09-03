import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught exception]:', error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6">
          <div className="max-w-[480px] w-full text-center bg-[#111111] border border-white/10 p-8 rounded-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-crown-gold/10 text-crown-gold flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              ✦
            </div>
            <h2 className="font-display text-[24px] text-white mb-2 uppercase tracking-wide">
              Something Went Wrong
            </h2>
            <p className="text-[12px] text-white/50 leading-relaxed mb-6">
              We experienced an unexpected interface error. Don't worry, your cart and preferences are safe.
            </p>
            <button
              onClick={this.handleReload}
              className="bg-crown-gold text-[#0A0A0A] px-8 py-3 text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-white transition-colors cursor-pointer rounded-sm"
            >
              Return To Store
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
