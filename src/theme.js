import { extendTheme } from "@chakra-ui/react";

export const COLORS = {
  // https://nipponcolors.com/
  black: "#373C38",
  white: "#eceeed",
  graph: "#f9f9f9",
  // https://flatuicolors.com/palette/de + https://themera.vercel.app/
  accent: {
    50: "#C4F3EE",
    500: "#78E2D7",
    600: "#2DD2C1",
  },
  purple: {
    50: "#DCC0F7",
    500: "#C597F1",
  },
  green: {
    500: "#22DD7E",
    600: "#1BB165",
  },
  blue: {
    50: "#BCE1FA",
    500: "#66B9F4",
  },
  orange: {
    50: "#FED7B8",
    500: "#FDA45E",
  },
  red: {
    50: "#FEB9BD",
    500: "#FC5F68",
  },
  yellow: {
    50: "#FFF0B8",
    500: "#FEDC5D",
  },
  // https://color.adobe.com/create/color-wheel starting from #FF9999
  orientacion0: {
    50: "#F3C4D1",
    500: "#FF9999",
  },
  orientacion1: {
    500: "#99FFB6",
  },
  orientacion2: {
    500: "#80FFEC",
  },
  orientacion3: {
    500: "#FF96FF",
  },
  orientacion4: {
    500: "#B3B27B",
  },
  orientacion5: {
    500: "#FFDEB0",
  },
  orientacion6: {
    500: "#DCFFC9",
  },
  orientacion7: {
    500: "#C9FFF7",
  },
};

export const customTheme = extendTheme({
  colors: {
    ...COLORS,
  },
});
