import React from "@rbxts/react";

import type { BindingValue } from "types/util/react";

import { useRem, useTheme } from "../../hooks";
import type { FrameProps } from "./frame";

export interface TextProps extends FrameProps<TextLabel> {
	/**
	 * The font of the text, defaults to the primary font specified in the
	 * defaultTheme.
	 */
	readonly Font?: BindingValue<Enum.Font>;
	/**
	 * The default properties of a `TextLabel` component, minus the ones
	 * specified in the TextProps.
	 */
	readonly Native?: Partial<
		Omit<React.InstanceProps<TextLabel>, "Font" | "Text" | "TextColor" | "TextSize">
	>;
	/** The text to display. */
	readonly Text: BindingValue<string>;
	/** The color of the text. */
	readonly TextColor?: BindingValue<Color3>;
	/** The size of the text. */
	readonly TextSize?: BindingValue<number>;
}

/**
 * Renders a text label component.
 *
 * @example
 *
 * ```tsx
 * <Text
 * 	Text={"Hello, world!"}
 * 	Native={{ Size: new UDim2(0, 100, 0, 50) }}
 * />;
 * ```
 *
 * @param textProps - The props for the Text component.
 * @returns The rendered Text component.
 * @component
 *
 * @see https://create.roblox.com/docs/reference/engine/classes/TextLabel
 */
export default function Text({
	CornerRadius,
	Font,
	Native,
	Text: _Text,
	TextColor,
	TextSize,
	children,
}: TextProps): React.Element {
	const rem = useRem();
	const theme = useTheme();

	const { AnchorPoint, BackgroundTransparency, Position } = Native ?? {};

	return (
		<textlabel
			{...Native}
			AnchorPoint={AnchorPoint ?? new Vector2(0.5, 0.5)}
			BackgroundTransparency={BackgroundTransparency ?? 1}
			Font={Font ?? theme.fonts.primary.regular}
			Position={Position ?? new UDim2(0.5, 0, 0.5, 0)}
			Text={_Text}
			TextColor3={TextColor}
			TextSize={TextSize ?? rem(1)}
		>
			{children}
			{CornerRadius ? <uicorner CornerRadius={CornerRadius} /> : undefined}
		</textlabel>
	);
}
