export enum GamePass {
	Example = "1",
}

export interface GamePassData {
	active: boolean;
	id: GamePass;
}

export enum Product {
	Example = "1",
}

export interface ProductData {
	id: number;
	timesPurchased: number;
}
