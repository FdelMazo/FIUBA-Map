import {
  AddIcon,
  CheckIcon,
  CloseIcon,
  Icon,
  MinusIcon,
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
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { FaUndo } from "react-icons/fa";
import { GraphContext } from "../../Contexts";

const ControlProps = {
  height: "fit-content",
  borderRadius: 'md',
  border: '2px solid white',
  mx: 3,
}

const TooltipProps = {
  closeOnClick: true,
  hasArrow: true,
}

const ButtonProps = {
  _hover: {
    backgroundColor: "transparent",
  },
  borderRadius: "0",
  variant: "link",
  fontSize: "larger"
}

const NumberInputProps = {
  _hover: {
    borderColor: "transparent",
  },
  _focus: {
    borderColor: "transparent",
  },
  color: "white",
  fontWeight: 'bold'
}

const NumberStepperProps = {
  border: "none",
  fontSize: "small"
}

const MateriaControl = () => {
  const { getNode, aprobar, displayedNode, desaprobar, cursando, getCurrentCuatri } =
    React.useContext(GraphContext);

  const node = React.useMemo(() => getNode(displayedNode), [displayedNode, getNode])

  return displayedNode && (
    <Flex alignItems="center" height="fit-content">
      <Flex {...ControlProps} alignItems="center" p={1}>
        {node?.nota > 0 ? (
          <>
            <Tooltip closeOnClick hasArrow label="Nota">
              <NumberInput
                borderColor="transparent"
                width="8ch"
                inputMode="numeric"
                onChange={(_, nota) => {
                  aprobar(displayedNode, nota);
                }}
                value={node?.nota}
                min={4}
                max={10}
                mx={1}
                onFocus={(ev) => {
                  ev.target.blur()
                }}
              >
                <NumberInputField {...NumberInputProps} />
                <NumberInputStepper height="100%" my={0}>
                  <NumberIncrementStepper
                    {...NumberStepperProps}
                    color="green.500"
                    _hover={{ color: "green.600" }}
                  />
                  <NumberDecrementStepper
                    {...NumberStepperProps}
                    color="red.500"
                    _hover={{ color: "red.600" }}
                  />
                </NumberInputStepper>
              </NumberInput>
            </Tooltip>
            <Tooltip closeOnClick hasArrow label="Aprobar por Equivalencia">
              <Button
                {...ButtonProps}
                fontSize="smaller"
                color="aprobadas.400"
                minWidth={0}
                ml={1}
                mr={2}
                onClick={() => aprobar(displayedNode, 0)}
              >
                <strong>E</strong>
              </Button>
            </Tooltip>
          </>
        ) : (
            <Tooltip {...TooltipProps} label="Aprobar">
            <Button
                {...ButtonProps}
              color="green.500"
              onClick={() => aprobar(displayedNode, 4)}
            >
              <CheckIcon />
            </Button>
          </Tooltip>
        )}

        <Tooltip {...TooltipProps} label="Desaprobar">
          <Button
            {...ButtonProps}
            borderX="2px solid white"
            color="red.500"
            onClick={() => desaprobar(displayedNode)}
          >
            <CloseIcon boxSize={4} />
          </Button>
        </Tooltip>

        <Tooltip {...TooltipProps} label="Poner en Final">
          <Button
            {...ButtonProps}
            color="yellow.300"
            onClick={() => aprobar(displayedNode, -1)}
          >
            <strong>F</strong>
          </Button>
        </Tooltip>
      </Flex>

      {node.categoria !== "CBC" && node.categoria !== "*CBC" && (
        <>
          {!node.cuatrimestre ?
            (
              <Tooltip {...TooltipProps} label="Planear Cuatrimestre">
                <Button
                  {...ButtonProps}
                  {...ControlProps}
                  p={0}
                  color="habilitadas.500"
                  onClick={() => cursando(displayedNode, getCurrentCuatri())}
                >
                  <strong>C</strong>
                </Button>
              </Tooltip>
            )
            :
            (
              <HStack {...ControlProps} p={0}>
                <Tooltip {...TooltipProps} label="Cuatrimestre">
                  <NumberInput
                    borderColor="transparent"
                    width="12ch"
                    onChange={(_, cuatri) => {
                      cursando(displayedNode, cuatri);
                    }}
                    value={node?.cuatrimestre}
                    format={(cuatristr) => {
                      const cuatri = parseFloat(cuatristr)
                      if (cuatri % 1 === 0) return `${cuatri}C1`;
                      return `${Math.floor(cuatri)}C2`;
                    }}
                    parse={(cuatristr) => {
                      const [y, c] = cuatristr.split("C");
                      if (c === "1") return y;
                      return y + 0.5;
                    }}
                    step={0.5}
                    precision={1}
                    onFocus={(ev) => {
                      ev.target.blur()
                    }}
                  >
                    <NumberInputField {...NumberInputProps} />
                    <NumberInputStepper height="100%" my={0}>
                      <NumberIncrementStepper
                        {...NumberStepperProps}
                        color="white"
                        _hover={{ color: "habilitadas.500" }}
                        children={<AddIcon boxSize={3} />}
                      />
                      <NumberDecrementStepper
                        {...NumberStepperProps}
                        color="grey"
                        _hover={{ color: "habilitadas.500" }}
                        children={<MinusIcon boxSize={3} />}
                      />
                    </NumberInputStepper>
                  </NumberInput>
                </Tooltip>

                <Tooltip {...TooltipProps} label="Limpiar">
                  <Button
                    {...ButtonProps}
                    _hover={{
                      color: "habilitadas.500"
                    }}
                    borderLeft="2px solid white"
                    color="white"
                    onClick={() => cursando(displayedNode, undefined)}
                  >
                    <Icon boxSize={3.5} as={FaUndo} />
                  </Button>
                </Tooltip>
              </HStack>
            )
          }
        </>)
      }
    </Flex>
  );
};

export default MateriaControl;
