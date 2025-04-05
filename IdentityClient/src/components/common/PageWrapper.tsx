import { Suspense, ComponentType } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

interface PageWrapperProps {
    component: ComponentType;
    title?: string;
    showHeader?: boolean;
}

/**
 * PageWrapper component that wraps page components with error boundary and suspense for lazy loading
 * Provides consistent layout for pages with optional title header
 */
export default function PageWrapper({ 
    component: Component, 
    title, 
    showHeader = true 
}: PageWrapperProps) {
    return (
        <div className="container mx-auto px-4 py-6">
            {showHeader && title && (
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">{title}</h1>
                </div>
            )}
            <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner size="large" fullScreen={false} />}>
                    <Component />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}
