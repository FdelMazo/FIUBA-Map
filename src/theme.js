import { extendTheme } from "@chakra-ui/react";

export const COLORS = {
  // https://nipponcolors.com/
  headerbg: "#222d38",
  graphbg: "#f7f9fa",
  headerbgdark: "#333333",
  graphbgdark: "#212121",
  text: "black",
  textdark: "white",

  // https://flatuicolors.com/palette/de + https://themera.vercel.app/
  electivas: {
    50: "#DCC0F7",
    400: "#C597F1",
    500: "#AF6FEC",
    600: "#821EE1",
  },
  aprobadas: {
    50: "#C1F5DB",
    100: "#99EFC4",
    400: "#22DD7E",
    500: "#22DD7E",
    600: "#1BB165",
  },
  habilitadas: {
    50: "#FED7B8",
    400: "#FDA45E",
    500: "#FC8A30",
  },
  cursando: {
    400: "#D4DBE2",
  },
  obligatorias: {
    50: "#BCE1FA",
    400: "#66B9F4",
    500: "#3CA6F1",
  },
  findecarrera: {
    50: "#FEB9BD",
    400: "#FC5F68",
    500: "#FB323D",
  },
  enfinal: {
    50: "#FFF0B8",
    400: "#FEDC5D",
    500: "#E1C252",
  },
  // https://color.adobe.com/create/color-wheel starting from #FF9999
  orientacion1: {
    50: "#FFE5E5",
    500: "#FF9999",
  },
  orientacion2: {
    50: "#B8FFFD",
    500: "#00cec9",
  },
  orientacion3: {
    50: "#FFE5FF",
    500: "#FF8AFF",
  },
  orientacion4: {
    500: "#C9EEED",
  },
  orientacion5: {
    500: "#E2A6B8",
  },
  orientacion6: {
    500: "#DCFFC9",
  },
  orientacion7: {
    500: "#f19066",
  },
  orientacion8: {
    500: "#ccae62",
  },
};

const config = {
  initialColorMode: "system",
};

export const customTheme = extendTheme({
  fonts: {
    body: "system-ui, sans-serif",
    heading: "Georgia, serif",
    mono: "Menlo, monospace",
  },
  colors: {
    ...COLORS,
  },
  config,
});
