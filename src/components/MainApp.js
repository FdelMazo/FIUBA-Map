import { Flex } from "@chakra-ui/react";
import React from "react";
import Body from "./Body/Body";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

const MainApp = () => {
  return (
    <Flex direction="column" h="100vh" overflow="hidden">
      <Header />
      <Body />
      <Footer />
    </Flex>
  );
};

export default MainApp;
