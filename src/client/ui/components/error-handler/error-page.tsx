// eslint-disable-next-line react-naming-convention/filename-extension -- Will be required when JSX is added.
import type React from "@rbxts/react";

interface ErrorPageProps {
	Message: string;
}

export default function ErrorPage({ Message }: Readonly<ErrorPageProps>): React.ReactNode {
	warn(Message);

	return undefined;
}
