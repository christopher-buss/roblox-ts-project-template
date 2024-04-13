export enum Gamepass {
	Example = "1",
}

export interface GamepassData {
	active: boolean;
	id: Gamepass;
}

export enum Product {
	Example = "1",
}

export interface ProductData {
	id: number;
	timesPurchased: number;
}
