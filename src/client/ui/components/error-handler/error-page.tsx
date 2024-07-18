import React from "@rbxts/react";

interface ErrorPageProps {
	readonly Message: string;
}

export default function ErrorPage({ Message }: ErrorPageProps): React.Element {
	warn(Message);

	// eslint-disable-next-line react/no-useless-fragment -- This is a placeholder for future functions.
	return <></>;
}
