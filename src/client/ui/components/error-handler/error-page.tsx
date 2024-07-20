import React from "@rbxts/react";

interface ErrorPageProps {
	Message: string;
}

export default function ErrorPage({ Message }: Readonly<ErrorPageProps>): React.Element {
	warn(Message);

	// eslint-disable-next-line react/no-useless-fragment -- This is a placeholder for a future error page.
	return <></>;
}
