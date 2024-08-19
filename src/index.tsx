import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
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

const container = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(
  <ChakraProvider theme={customTheme}>
    <App />
  </ChakraProvider>,
);
