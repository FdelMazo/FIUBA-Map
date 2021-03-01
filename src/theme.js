import { extendTheme } from "@chakra-ui/react";

export const COLORS = {
  // https://nipponcolors.com/
  headerbg: "#373C38",
  graphbg: "#f9f9f9",
  // https://flatuicolors.com/palette/de + https://themera.vercel.app/
  electivas: {
    50: "#DCC0F7",
    400: "#C597F1",
    500: "#AF6FEC",
  },
  aprobadas: {
    400: "#22DD7E",
    500: "#22DD7E",
    600: "#1BB165",
  },
  habilitadas: {
    50: "#FED7B8",
    400: "#FDA45E",
    500: "#FC8A30",
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
    500: "#CBA001",
  },
  // https://color.adobe.com/create/color-wheel starting from #FF9999
  orientacion0: {
    50: "#D4D4B5",
    400: "#C3C397",
    500: "#A2A15D",
  },
  orientacion1: {
    500: "#FF9999",
  },
  orientacion2: {
    500: "#80FFEC",
  },
  orientacion3: {
    500: "#FF96FF",
  },
  orientacion4: {
    500: "#5CFF8A",
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
