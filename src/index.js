import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import MainApp from "./components/MainApp";
import { customTheme } from "./theme";
import { MapProvider } from "./MapContext";

const App = () => {
  return (
    <MapProvider>
        <MainApp />
    </MapProvider>
  );
};

ReactDOM.render(
  <ChakraProvider theme={customTheme}>
    <ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
    <App />
  </ChakraProvider>,
  document.getElementById("root")
);
