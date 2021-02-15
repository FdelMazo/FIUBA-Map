import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
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
  const { nodeFunctions } = React.useContext(GraphContext);
  const { getNode } = nodeFunctions;

  return (
    <Flex alignItems="center">
      <Stat
        mx={3}
        color="white"
        css={{ "& *": { marginTop: 0, marginBottom: 0 } }}
        size="sm"
      >
        <StatLabel>[{getNode(displayedNode).id}]</StatLabel>
        <StatHelpText>
          <Text maxWidth="20ch" isTruncated>
            {getNode(displayedNode).materia}
          </Text>
        </StatHelpText>
      </Stat>
      <Popover autoFocus placement="bottom-start">
        <PopoverTrigger>
          <Box>
            <Tooltip closeOnClick={true} hasArrow label="Aprobar">
              <IconButton colorScheme="whatsapp" icon={<CheckIcon />} />
            </Tooltip>
          </Box>
        </PopoverTrigger>
        <PopoverContent w="fit-content" borderColor="black">
          <PopoverArrow />
          <PopoverBody>
            <Flex>
              <Box justifySelf="flex-end">
                <NumberInput
                  focusBorderColor="green.500"
                  inputMode="numeric"
                  defaultValue={7}
                  min={4}
                  mx={5}
                  max={10}
                >
                  <NumberInputField w="4ch" />
                  <NumberInputStepper w="2ch">
                    <NumberIncrementStepper color="black" />
                    <NumberDecrementStepper color="black" />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Tooltip hasArrow label="Desaprobar">
        <IconButton mx={3} colorScheme="red" icon={<CloseIcon />} />
      </Tooltip>
      <Tooltip hasArrow label="Poner en Final">
        <Button colorScheme="blackAlpha">F</Button>
      </Tooltip>

      <Box float="right" right="0" position="absolute" mr={3}>
        <Stat
          textAlign="right"
          justifySelf="flex-end"
          color="white"
          css={{ "& *": { marginTop: 0, marginBottom: 0 } }}
          size="sm"
        >
          <StatLabel>Créditos</StatLabel>
          <StatHelpText>Otorga {getNode(displayedNode).creditos}</StatHelpText>
          {getNode(displayedNode).requiere && (
            <StatHelpText>
              Requiere {getNode(displayedNode).requiere}
            </StatHelpText>
          )}
        </Stat>
      </Box>
    </Flex>
  );
};

export default Header;
