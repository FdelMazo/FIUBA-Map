import React from "react";
import PadronInput from "./PadronInput";
import CarreraSelect from "./CarreraSelect";
import { GraphContext, UserContext } from "../Contexts";

import {
  Box,
  Flex,
  useDisclosure,
  IconButton,
  Button,
  Collapse,
  SlideFade,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
} from "@chakra-ui/react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { MinusIcon, AddIcon, SettingsIcon } from "@chakra-ui/icons";

const Promedio = () => <Box>Promedio: 7.50</Box>;

const Header = (props) => {
  const { displayedNode } = props;
  const { nodeFunctions } = React.useContext(GraphContext);
  const { getNode } = nodeFunctions;
  const { logged } = React.useContext(UserContext);

  const { isOpen, onToggle } = useDisclosure();

  return (
    <Flex
      color="white"
      align="center"
      justify="space-between"
      bg="primary"
      padding="0.6rem"
    >
      {logged ? (
        <>
          {displayedNode && (
            <Collapse in={displayedNode}>
              <HStack justify-content="space-between" spacing={10}>
                <>
                  [{getNode(displayedNode).id}] {getNode(displayedNode).materia}
                </>
                <NumberInput defaultValue={4} min={4} max={10}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Popover trigger="hover">
                  <PopoverTrigger>
                    <IconButton icon={<AddIcon />}></IconButton>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverHeader
                      size="sm"
                      fontWeight="semibold"
                      color="primary"
                    >
                      Aprobar
                    </PopoverHeader>
                    <PopoverArrow />
                  </PopoverContent>
                </Popover>
                <Popover trigger="hover">
                  <PopoverTrigger>
                    <IconButton icon={<MinusIcon />}></IconButton>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverHeader
                      size="sm"
                      fontWeight="semibold"
                      color="primary"
                    >
                      Desaprobar
                    </PopoverHeader>
                    <PopoverArrow />
                  </PopoverContent>
                </Popover>
                <Popover trigger="hover">
                  <PopoverTrigger>
                    <Button>F</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverHeader
                      size="sm"
                      fontWeight="semibold"
                      color="primary"
                    >
                      Poner en Final
                    </PopoverHeader>
                    <PopoverArrow />
                  </PopoverContent>
                </Popover>
              </HStack>
            </Collapse>
          )}
          <SlideFade in={!displayedNode}>
            <PadronInput />
          </SlideFade>
          <SlideFade in={!displayedNode}>
            <Promedio />
          </SlideFade>
        </>
      ) : (
        <>
          <Box>
            <PadronInput />
          </Box>
          <Box>
            <CarreraSelect />
          </Box>
        </>
      )}
    </Flex>
  );
};

export default Header;
