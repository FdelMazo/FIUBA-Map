import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, Flex } from "@chakra-ui/react";
import { customTheme } from "./theme";
import MainApp from "./components/MainApp";
import { UserContext, GraphContext } from "./Contexts";
import useLogin from "./useLogin";
import useGraph from "./useGraph";

const App = () => {
  const loginHook = useLogin();
  const graphHook = useGraph();

  return (
    <UserContext.Provider value={loginHook}>
      <GraphContext.Provider value={graphHook}>
        <MainApp />
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
