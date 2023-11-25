import { component } from "@rbxts/matter";

export const Renderable = component<{ doNotDestroy?: boolean; model: Model }>("Renderable");
export type Renderable = ReturnType<typeof Renderable>;
