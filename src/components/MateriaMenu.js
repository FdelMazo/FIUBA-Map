import { CheckIcon } from "@chakra-ui/icons";
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
  const { getNode, aprobar, ponerEnFinal } = React.useContext(GraphContext);
  const [nota, setNota] = React.useState(getNode(displayedNode).nota || 7);

  React.useEffect(() => {
    aprobar(displayedNode, nota);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nota, displayedNode]);

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
              <IconButton
                size="sm"
                colorScheme="whatsapp"
                icon={<CheckIcon />}
              />
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
                  onChange={(_, nota) => {
                    setNota(nota);
                  }}
                  value={nota}
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

      <Tooltip hasArrow label="Poner en Final">
        <Button
          mx={3}
          size="sm"
          onClick={() => ponerEnFinal(displayedNode)}
          colorScheme="yellow"
        >
          F
        </Button>
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
