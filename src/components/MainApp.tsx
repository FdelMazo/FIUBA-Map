import { Flex } from "@chakra-ui/react";
import Body from "./Body/Body";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

const MainApp = () => {
  return (
    <Flex
      direction="column"
      overflow="hidden"
      sx={{
        height: "100vh",
        "@supports (height: 100dvh)": { height: "100dvh" },
      }}
    >
      <Header />
      <Body />
      <Footer />
    </Flex>
  );
};

export default MainApp;
