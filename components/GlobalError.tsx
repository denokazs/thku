'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class GlobalError extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-red-500 p-10 flex-col gap-4">
                    <h1 className="text-3xl font-bold">Application Crashed</h1>
                    <pre className="bg-black/50 p-4 rounded overflow-auto max-w-4xl border border-red-900">
                        {this.state.error?.toString()}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalError;
