import {
  CheckIcon,
  CloseIcon,
  Icon,
} from "@chakra-ui/icons";
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
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext } from "../Contexts";

const Header = (props) => {
  const { displayedNode } = props;
  const { getNode, aprobar, desaprobar, cursando } =
    React.useContext(GraphContext);

  const getCurrentCuatri = () => {
    const today = new Date();
    let cuatri = today.getFullYear();
    const month = today.getMonth();
    if (month > 6) cuatri = cuatri + 0.5;
    return cuatri;
  }

  const formatCuatri = (cuatristr) => {
    if (!cuatristr) return "/";
    const cuatri = parseFloat(cuatristr)
    if (cuatri % 1 === 0) return `${cuatri}C1`;
    return `${Math.floor(cuatri)}C2`;
  };

  const parseCuatri = (cuatristr) => {
    if (cuatristr === "/") return undefined;
    const [y, c] = cuatristr.split("C");
    if (c === "1") return y;
    return y + 0.5;
  }

  return (
    <Flex height="4em" alignItems="center" justifyContent="space-around">
      <Stat alignSelf="flex-end" mx={3} color="white">
        <StatLabel>[{getNode(displayedNode)?.id}]</StatLabel>
        <StatHelpText isTruncated width="30ch">
          {getNode(displayedNode)?.materia}
        </StatHelpText>
      </Stat>

      <Flex borderRadius={6} border="2px solid white" p={1} alignItems="center" height={"70%"}>
        {getNode(displayedNode)?.nota > 0 ? (
          <Tooltip closeOnClick hasArrow label="Aprobar con Nota">
            <>
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
              <Tooltip closeOnClick hasArrow label="Aprobar por Equivalencia">
                <Button
                  alignSelf="center"
                  _hover={{
                    backgroundColor: "transparent",
                  }}
                  variant="link"
                  fontSize="small"
                  color="aprobadas.400"
                  minW={0}
                  mr={2}
                  onClick={() => aprobar(displayedNode, 0)}
                >
                  <strong>E</strong>
                </Button>
              </Tooltip>
            </>
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

      <HStack borderRadius={6} ml={2} border="2px solid white" height={"60%"}>
        <Tooltip closeOnClick hasArrow label="Planear Cuatri">
          <NumberInput
            css={{ margin: 0 }}
            errorBorderColor="white.500"
            borderColor="transparent"
            onChange={(_, cuatri) => {
              cursando(displayedNode, cuatri);
            }}
            value={getNode(displayedNode)?.cuatrimestre}
            format={formatCuatri}
            parse={parseCuatri}
            step={0.5}
            precision={1}
            key={getNode(displayedNode)?.cuatrimestre}
            min={getNode(displayedNode)?.cuatrimestre ? 1986 : getCurrentCuatri()}
            max={2050}
          >
            <NumberInputField
              _hover={{
                borderColor: "transparent",
              }}
              _focus={{
                borderColor: "transparent",
              }}
              p={0}
              ml={2}
              w="10ch"
              color="white"
              fontWeight="bold"
            />
            <NumberInputStepper>
              <NumberIncrementStepper
                border="none"
                color="cursando.500"
                fontSize="large"
                height="50%"
                children={<strong>+</strong>}
              />
              <NumberDecrementStepper
                border="none"
                color="futuro.1000"
                fontSize="large"
                height="50%"
                children={<strong>-</strong>}
              />
            </NumberInputStepper>
          </NumberInput>
        </Tooltip>

        <Tooltip closeOnClick hasArrow label="Limpiar Cuatri">
          <Button
            _hover={{
              backgroundColor: "transparent",
            }}
            borderRadius="0"
            cursor="pointer"
            variant="link"
            borderLeft="2px solid white"
            fontSize="larger"
            color="cursando.500"
            onClick={() => cursando(displayedNode, undefined)}
          >
            <Icon boxSize={5} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.2071 2.29289C12.5976 2.68342 12.5976 3.31658 12.2071 3.70711L10.9142 5H12.5C17.1523 5 21 8.84772 21 13.5C21 18.1523 17.1523 22 12.5 22C7.84772 22 4 18.1523 4 13.5C4 12.9477 4.44772 12.5 5 12.5C5.55228 12.5 6 12.9477 6 13.5C6 17.0477 8.95228 20 12.5 20C16.0477 20 19 17.0477 19 13.5C19 9.95228 16.0477 7 12.5 7H10.9142L12.2071 8.29289C12.5976 8.68342 12.5976 9.31658 12.2071 9.70711C11.8166 10.0976 11.1834 10.0976 10.7929 9.70711L7.79289 6.70711C7.40237 6.31658 7.40237 5.68342 7.79289 5.29289L10.7929 2.29289C11.1834 1.90237 11.8166 1.90237 12.2071 2.29289Z"
              />
            </Icon>

          </Button>
        </Tooltip>
      </HStack>
    </Flex>
  );
};

export default Header;
