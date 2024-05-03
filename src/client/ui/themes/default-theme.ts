import { fonts } from "./fonts";
import { images } from "./images";
import type { Theme } from "./theme";

export const defaultTheme: Theme = {
	colors: {
		background: Color3.fromRGB(0, 0, 0),
		border: Color3.fromRGB(0, 0, 0),
		card: Color3.fromRGB(0, 0, 0),
		primary: Color3.fromRGB(0, 0, 0),
		secondary: Color3.fromRGB(0, 0, 0),
		text: {
			link: Color3.fromRGB(0, 0, 0),
			primary: Color3.fromRGB(0, 0, 0),
			secondary: Color3.fromRGB(0, 0, 0),
		},
	},
	fonts,
	images,
};
