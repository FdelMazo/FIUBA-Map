import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, Flex } from "@chakra-ui/core";
import { customTheme } from "./theme";
import Header from "./components/Header";
import Body from "./components/Body";
import Footer from "./components/Footer";
import { UserContext, GraphContext } from "./Contexts";
import useLogin from "./useLogin";
import useGraph from "./useGraph";

const App = () => {
  const loginHook = useLogin();
  const graphHook = useGraph();

  return (
    <UserContext.Provider value={loginHook}>
      <GraphContext.Provider value={graphHook}>
        <Flex direction="column" h="100vh">
          <Header />
          <Body />
          <Footer />
        </Flex>
      </GraphContext.Provider>
    </UserContext.Provider>
  );
};

ReactDOM.render(
  <>
    <ThemeProvider theme={customTheme}>
      <App />
    </ThemeProvider>
  </>,
  document.getElementById("root")
);
