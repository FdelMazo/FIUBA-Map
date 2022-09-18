import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";
import * as ReactDOM from 'react-dom/client';
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

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <ChakraProvider theme={customTheme}>
    <ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
    <App />
  </ChakraProvider>
);
