import React from "@rbxts/react";

interface ErrorPageProps {
	readonly Message: string;
}

export default function ErrorPage({ Message }: ErrorPageProps): React.Element {
	warn(Message);

	return <></>;
}
