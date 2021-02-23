import { ThemeProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import MainApp from "./components/MainApp";
import { GraphContext, UserContext } from "./Contexts";
import { customTheme } from "./theme";
import useGraph from "./useGraph";
import useLogin from "./useLogin";

const App = () => {
  const loginHook = useLogin();
  const graphHook = useGraph(loginHook);

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
