import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Flex,
  HStack,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  SlideFade,
} from "@chakra-ui/react";
import React from "react";
import CARRERAS from "../carreras";
import { GraphContext, UserContext } from "../Contexts";
import PadronInput from "./PadronInput";

const Header = (props) => {
  const { displayedNode } = props;
  const { nodeFunctions, changeCarrera } = React.useContext(GraphContext);
  const { getNode } = nodeFunctions;
  const { logged } = React.useContext(UserContext);

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
        </>
      ) : (
        <>
          <Box>
            <PadronInput />
          </Box>
          <Box>
            <Select
              css={{ color: "#ffffff" }}
              onChange={(e) => changeCarrera(e.target.value)}
            >
              {Object.keys(CARRERAS).map((id) => (
                <option value={id}>{CARRERAS[id].nombre}</option>
              ))}
            </Select>
          </Box>
        </>
      )}
    </Flex>
  );
};

export default Header;
