import { COLORS } from "../theme";

export const palette = { ...COLORS } as const;

export type Palette = typeof palette;

export type Color = "habilitadas" | "enfinal" | "findecarrera";
