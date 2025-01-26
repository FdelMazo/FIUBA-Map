import { Box, Modal, ModalOverlay, useColorModeValue } from "@chakra-ui/react";
import React from "react";

const injectStyle = (style) => {
  const styleElement = document.createElement("style");
  let styleSheet = null;
  document.head.appendChild(styleElement);
  styleSheet = styleElement.sheet;
  styleSheet.insertRule(style, styleSheet.cssRules.length);
};

// El mejor loading component que existe
const LoadingGraph = () => {
  const keyframesStyle = `
      @keyframes sk-rotateplane {
        0% {
          transform: perspective(120px) rotateX(0deg) rotateY(0deg);
          -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg)
        } 50% {
          transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
          -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg)
        } 100% {
          transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
          -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
        }
      }
    `;

  injectStyle(keyframesStyle);
  return (
    <Modal isOpen={true}>
      <ModalOverlay />
      <Box
        position="fixed"
        top="25%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <Box
          animation="sk-rotateplane 1.2s infinite ease-in-out"
          bg={useColorModeValue("headerbg", "white")}
          h="3em"
          w="3em"
          zIndex={1450}
        />
      </Box>
    </Modal>
  );
};

export default LoadingGraph;
