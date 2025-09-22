import Log from "@rbxts/log";
import type { ErrorInfo } from "@rbxts/react";
import React, { ReactComponent } from "@rbxts/react";

interface ErrorBoundaryProps extends React.PropsWithChildren {
	onFallback: (error: unknown) => React.ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	message?: unknown;
}

/**
 * ErrorBoundary component that catches and handles errors in its child
 * components.
 *
 * @example
 *
 * ```tsx
 * <ErrorBoundary
 * 	fallback={message => <ErrorPage message={tostring(message)} />}
 * />;
 * ```
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
@ReactComponent
export class ErrorBoundary extends React.Component<
	Readonly<ErrorBoundaryProps>,
	ErrorBoundaryState
> {
	public override readonly state: ErrorBoundaryState = {
		hasError: false,
	};

	public override componentDidCatch(err: unknown, errorInfo: ErrorInfo): void {
		Log.Warn(tostring(err), errorInfo.componentStack);

		this.setState({
			hasError: true,
			message: `${error} ${errorInfo.componentStack}`,
		});
	}

	public override render(): React.ReactNode {
		const { hasError, message } = this.state;
		const { onFallback, children } = this.props;

		if (hasError) {
			return onFallback(message);
		}

		return children;
	}
}
