import {
  Button,
  Flex,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stat,
  StatHelpText,
  StatLabel,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext } from "../Contexts";

const Header = (props) => {
  const { displayedNode } = props;
  const { getNode, aprobar, ponerEnFinal } = React.useContext(GraphContext);

  const format = (nota) => {
    if (nota === -1) return "/";
    return nota;
  };

  return (
    <Flex height="4em" alignItems="center" justifyContent="space-around">
      <Stat mx={3} color="white">
        <StatLabel>[{getNode(displayedNode)?.id}]</StatLabel>
        <StatHelpText>
          <Text width="30ch" isTruncated>
            {getNode(displayedNode)?.materia}
          </Text>
        </StatHelpText>
      </Stat>
      <HStack borderRadius={6} border="2px solid white">
        <NumberInput
          css={{ margin: 0 }}
          errorBorderColor="transparent"
          borderColor="transparent"
          inputMode="numeric"
          onChange={(_, nota) => {
            aprobar(displayedNode, nota);
          }}
          value={format(getNode(displayedNode)?.nota)}
          min={4}
          max={10}
        >
          <NumberInputField
            _hover={{
              borderColor: "transparent",
            }}
            _focus={{
              borderColor: "transparent",
            }}
            w="7ch"
            color="white"
            fontWeight="bold"
          />
          <NumberInputStepper>
            <NumberIncrementStepper
              border="none"
              fontSize="small"
              color="green.500"
            />
            <NumberDecrementStepper
              border="none"
              fontSize="small"
              color="red.500"
            />
          </NumberInputStepper>
        </NumberInput>
        <Tooltip closeOnClick={true} hasArrow label="Poner en Final">
          <Button
            colorScheme="teal"
            _hover={{
              backgroundColor: "transparent",
            }}
            borderRadius="0"
            cursor="pointer"
            variant="link"
            borderLeft="2px solid white"
            fontSize="larger"
            color="yellow.300"
            onClick={() => ponerEnFinal(displayedNode)}
          >
            <strong>F</strong>
          </Button>
        </Tooltip>
      </HStack>
    </Flex>
  );
};

export default Header;
