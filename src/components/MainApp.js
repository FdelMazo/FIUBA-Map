import React, { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

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
