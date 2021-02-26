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
    <Flex alignItems="center" justifyContent="space-around">
      <Stat
        mx={3}
        color="white"
        css={{ "& *": { marginTop: 0, marginBottom: 0 } }}
        size="sm"
      >
        <StatLabel>[{getNode(displayedNode)?.id}]</StatLabel>
        <StatHelpText>
          <Text width="30ch" isTruncated>
            {getNode(displayedNode)?.materia}
          </Text>
        </StatHelpText>
      </Stat>
      <HStack borderRadius={6} border="2px solid white" p="0">
        <NumberInput
          css={{ margin: 0 }}
          color="green.600"
          borderColor="transparent"
          errorBorderColor="transparent"
          border="transparent"
          inputMode="numeric"
          onChange={(_, nota) => {
            aprobar(displayedNode, nota);
          }}
          value={format(getNode(displayedNode)?.nota)}
          min={4}
          mx={5}
          max={10}
        >
          <NumberInputField
            _hover={{
              borderColor: "transparent",
            }}
            _focus={{
              borderColor: "transparent",
            }}
            w="4ch"
            color="white"
            fontWeight="bold"
          />
          <NumberInputStepper w="2ch">
            <NumberIncrementStepper
              fontSize="small"
              w="2em"
              color="green.600"
            />
            <NumberDecrementStepper
              borderRightColor="white"
              fontSize="small"
              w="2em"
              color="red.600"
            />
          </NumberInputStepper>
        </NumberInput>
        <Tooltip closeOnClick={true} hasArrow label="Poner en Final">
          <Button
            _hover={{
              backgroundColor: "transparent",
            }}
            p={0}
            cursor="pointer"
            variant="link"
            bg="transparent"
            borderTopColor="transparent"
            borderBottomColor="transparent"
            borderRightColor="transparent"
            borderLeftColor="white"
            borderRadius={0}
            height="100%"
            fontSize="larger"
            color="yellow.500"
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
