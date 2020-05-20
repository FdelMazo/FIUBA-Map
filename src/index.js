import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, Flex } from "@chakra-ui/core";
import { customTheme } from "./theme";
import { Header, Body } from "./components";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <Flex direction="column" h="100vh">
        <Header />
        <Body />
      </Flex>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
