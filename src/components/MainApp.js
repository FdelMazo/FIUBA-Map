import { Flex } from "@chakra-ui/react";
import React from "react";
import Body from "./Body/Body";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

const MainApp = () => {
  const [displayedNode, setDisplayedNode] = React.useState("");

  return (
    <Flex direction="column" h="100vh">
      <Header displayedNode={displayedNode} />
      <Body setDisplayedNode={setDisplayedNode} />
      <Footer />
    </Flex>
  );
};

export default MainApp;
