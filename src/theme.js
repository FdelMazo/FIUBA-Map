import { extendTheme } from "@chakra-ui/react";

export const COLORS = {
  black: "#2C3A47",
  white: "#fff",
  graph: "#CAD3C8",
  accent: {
    50: "#CAD3C8",
    500: "#82589F",
    600: "#502BA1",
  },
  purple: {
    50: "#D6A2E8",
    500: "#82589F",
  },
  green: {
    500: "#55E6C1",
    600: "#FD7272",
  },
  blue: {
    50: "#25CCF7",
    500: "#1B9CFC",
  },
  orange: {
    500: "#FEA47F",
  },
  red: {
    50: "#FC427B",
    500: "#FD7272",
  },
  yellow: {
    500: "#B794F4",
  },
  ingles: {
    50: "#F8EFBA",
    500: "#BDC581",
    600: "#FD7272",
  },
  practicaprofesional: {
    50: "#9AECDB",
    500: "#58B19F",
  },
  orientacion0: {
    50: "#82589F",
    500: "#82589F",
  },
  orientacion1: {
    50: "#B794F4",
    500: "#B794F4",
  },
  orientacion2: {
    50: "#B794F4",
    500: "#B794F4",
  },
  orientacion3: {
    50: "#B794F4",
    500: "#B794F4",
  },
  orientacion4: {
    50: "#B794F4",
    500: "#B794F4",
  },
  orientacion5: {
    50: "#B794F4",
    500: "#B794F4",
  },
  orientacion6: {
    50: "#B794F4",
    500: "#B794F4",
  },
  orientacion7: {
    50: "#B794F4",
    500: "#B794F4",
  },
};

export const customTheme = extendTheme({
  colors: {
    ...COLORS,
  },
});
