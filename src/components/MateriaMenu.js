import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import {
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
  const { getNode, aprobar, desaprobar, cursando } =
    React.useContext(GraphContext);
  const [moreOptionsOpen, setMoreOptionsOpen] = React.useState(
    getNode(displayedNode)?.cuatri > -1
  );

  const formatCuatri = (cuatri) => {
    if (cuatri === -1) return "/";
    return `+` + cuatri;
  };

  return (
    <Flex height="4em" alignItems="center" justifyContent="space-around">
      <Stat alignSelf="flex-end" mx={3} color="white">
        <StatLabel>[{getNode(displayedNode)?.id}]</StatLabel>
        <StatHelpText>
          <Text width="30ch" isTruncated>
            {getNode(displayedNode)?.materia}
          </Text>
        </StatHelpText>
      </Stat>

      <Flex borderRadius={6} border="2px solid white" p={1} alignItems="center">
        {getNode(displayedNode)?.nota > 0 ? (
          <Tooltip closeOnClick hasArrow label="Aprobar con Nota">
            <NumberInput
              css={{ margin: 0 }}
              errorBorderColor="transparent"
              borderColor="transparent"
              inputMode="numeric"
              onChange={(_, nota) => {
                aprobar(displayedNode, nota);
              }}
              value={getNode(displayedNode)?.nota}
              min={4}
              max={10}
              maxW={16}
            >
              <NumberInputField
                _hover={{
                  borderColor: "transparent",
                }}
                _focus={{
                  borderColor: "transparent",
                }}
                color="white"
                fontWeight="bold"
              />
              <NumberInputStepper mr={1}>
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
          </Tooltip>
        ) : (
          <Tooltip closeOnClick hasArrow label="Aprobar">
            <Button
              _hover={{
                backgroundColor: "transparent",
              }}
              borderRadius="0"
              variant="link"
              fontSize="larger"
              color="green.500"
              onClick={() => aprobar(displayedNode, 4)}
            >
              <CheckIcon />
            </Button>
          </Tooltip>
        )}

        <Tooltip closeOnClick hasArrow label="Desaprobar">
          <Button
            _hover={{
              backgroundColor: "transparent",
            }}
            borderRadius="0"
            variant="link"
            borderLeft="2px solid white"
            borderRight="2px solid white"
            color="red.500"
            onClick={() => desaprobar(displayedNode)}
          >
            <CloseIcon />
          </Button>
        </Tooltip>

        <Tooltip closeOnClick hasArrow label="Poner en Final">
          <Button
            _hover={{
              backgroundColor: "transparent",
            }}
            borderRadius="0"
            variant="link"
            fontSize="larger"
            color="yellow.300"
            onClick={() => aprobar(displayedNode, -1)}
          >
            <strong>F</strong>
          </Button>
        </Tooltip>
      </Flex>

      <Tooltip closeOnClick hasArrow label="Más Opciones">
        <IconButton
          mx={4}
          border="2px"
          onClick={() => setMoreOptionsOpen(!moreOptionsOpen)}
          variant="outline"
          color="white"
          colorScheme="whiteAlpha"
          fontSize="20px"
          transform="rotate(90deg)"
          icon={moreOptionsOpen ? <ArrowRightIcon /> : <ArrowLeftIcon />}
        />
      </Tooltip>

      <Collapse in={moreOptionsOpen} direction="left">
        <HStack spacing={4}>
          <HStack borderRadius={6} ml={1} border="2px solid white">
            <Tooltip closeOnClick hasArrow label="Cursando Actualmente">
              <Button
                _hover={{
                  backgroundColor: "transparent",
                }}
                borderRadius="0"
                cursor="pointer"
                variant="link"
                borderRight="2px solid white"
                fontSize="larger"
                color="cursando.500"
                onClick={() => cursando(displayedNode, 0)}
              >
                <strong>C</strong>
              </Button>
            </Tooltip>

            <Tooltip closeOnClick hasArrow label="A cursar en N cuatris">
              <NumberInput
                css={{ margin: 0 }}
                errorBorderColor="white.500"
                borderColor="transparent"
                onChange={(_, cuatri) => {
                  cursando(displayedNode, cuatri);
                }}
                value={formatCuatri(getNode(displayedNode)?.cuatri)}
                min={0}
                max={10}
              >
                <NumberInputField
                  _hover={{
                    borderColor: "transparent",
                  }}
                  _focus={{
                    borderColor: "transparent",
                  }}
                  p={0}
                  w="6ch"
                  color="white"
                  fontWeight="bold"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper
                    border="none"
                    color="cursando.500"
                    fontSize="large"
                    children={<strong>+</strong>}
                  />
                  <NumberDecrementStepper
                    border="none"
                    color="futuro.1000"
                    fontSize="large"
                    children={<strong>-</strong>}
                  />
                </NumberInputStepper>
              </NumberInput>
            </Tooltip>
          </HStack>
          <Tooltip closeOnClick hasArrow label="Aprobar por Equivalencia">
            <Button
              p={2}
              _hover={{
                backgroundColor: "transparent",
              }}
              cursor="pointer"
              variant="link"
              border="2px solid white"
              fontSize="larger"
              color="aprobadas.400"
              onClick={() => aprobar(displayedNode, 0)}
            >
              <strong>E</strong>
            </Button>
          </Tooltip>
        </HStack>
      </Collapse>
    </Flex>
  );
};

export default Header;
