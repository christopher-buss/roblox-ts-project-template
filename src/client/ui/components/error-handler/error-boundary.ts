import Log from "@rbxts/log";
import type { ErrorInfo } from "@rbxts/react";
import React, { ReactComponent } from "@rbxts/react";

interface ErrorBoundaryProps extends React.PropsWithChildren {
	Fallback: (error: unknown) => React.ReactNode;
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
export default class ErrorBoundary extends React.Component<
	Readonly<ErrorBoundaryProps>,
	ErrorBoundaryState
> {
	public readonly state: ErrorBoundaryState = {
		hasError: false,
	};

	public componentDidCatch(err: unknown, errorInfo: ErrorInfo): void {
		Log.Warn(tostring(err), errorInfo.componentStack);

		this.setState({
			hasError: true,
			message: `${error} ${errorInfo.componentStack}`,
		});
	}

	public render(): React.ReactNode {
		const { hasError, message } = this.state;
		const { Fallback, children } = this.props;

		if (hasError) {
			return Fallback(message);
		}

		return children;
	}
}
