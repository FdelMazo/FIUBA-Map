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
  Box,
  Text,
  Link,
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
import { GraphContext, UserContext } from "../../Contexts";
import { getCurrentCuatri } from "../../utils";

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
  const { fiubaRepos, isMobile, logged } = React.useContext(UserContext);

  const { getNode, aprobar, displayedNode, desaprobar, cursando } =
    React.useContext(GraphContext);

  const node = React.useMemo(() => getNode(displayedNode), [displayedNode, getNode])
  const repos = React.useMemo(() => fiubaRepos.find(materia => materia.codigos.includes(node?.id.replace('.', ''))), [fiubaRepos, node])

  return displayedNode && logged && (node?.id !== "CBC") && (
    <Flex alignItems="center" height="fit-content">
      {!isMobile && repos && (
        <>
          <Tooltip closeOnClick hasArrow label={
            <Box textAlign="center">
              <Text>
                Chusmeá {repos.reponames.size === 1 ? 'el FIUBA-Repo' : `los ${repos.reponames.size} FIUBA-Repos`}
              </Text>
              <Text>
                de esta materia!
              </Text>
            </Box>
          }>
            <Link
              mx={3}
              isExternal
              color="white"
              href={`https://fede.dm/FIUBA-Repos?c=${node?.id.replace('.', '')}`}
            >
              <Icon boxSize={5} viewBox="0 0 16 16">
                <path
                  fill="currentColor"
                  d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
                />
              </Icon>
            </Link>
          </Tooltip>
        </>
      )}

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

      {node?.categoria !== "CBC" && node?.categoria !== "*CBC" && (
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
