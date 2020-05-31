import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, Flex } from "@chakra-ui/core";
import { customTheme } from "./theme";
import Header from "./components/Header";
import Body from "./components/Body";
import Footer from "./components/Footer";
import UserContext from "./UserContext";
import useLogin from "./useLogin";

const App = () => {
  const loginHook = useLogin();
  return (
    <UserContext.Provider value={loginHook}>
      <Flex direction="column" h="100vh">
        <Header />
        <Body />
        <Footer />
      </Flex>
    </UserContext.Provider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
