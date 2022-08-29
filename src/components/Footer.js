import {
  CheckIcon,
  EditIcon,
  PlusSquareIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Checkbox,
  Collapse,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Grid,
  GridItem,
  Icon,
  IconButton,
  LightMode,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  PinInput,
  PinInputField,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useColorModeValue,
  useEditableControls,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../Contexts";
import useWindowSize from "./useWindowSize";

const Footer = () => {
  const { logged, user } = React.useContext(UserContext);
  const {
    promedio,
    creditos,
    stats,
    toggleCheckbox,
    optativas,
    addOptativa,
    aplazos,
    setAplazos,
    promedioConAplazos,
    promedioConCBC,
    editOptativa,
    removeOptativa,
    loadingGraph
  } = React.useContext(GraphContext);
  const size = useWindowSize();
  const mobile = size.width < 750;

  function EditableControls(props) {
    const { isEditing, getSubmitButtonProps, getEditButtonProps } =
      useEditableControls();

    const { defaultValue, optativa } = props;
    return (
      <>
        <Tooltip placement="top" label="Créditos" hasArrow>
          <NumberInput
            mr={1}
            borderRadius={5}
            size="sm"
            maxW={isEditing ? 16 : 14}
            defaultValue={defaultValue}
            min={1}
            onChange={(_, creditos) => {
              if (isNaN(creditos)) return;
              editOptativa(optativa.id, optativa.nombre, creditos);
            }}
            isReadOnly={!isEditing}
          >
            <NumberInputField />
            {isEditing && (
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            )}
          </NumberInput>
        </Tooltip>

        {isEditing ? (
          <Tooltip placement="top" label="Confirmar" hasArrow>

            <IconButton
              size="sm"
              icon={<CheckIcon />}
              {...getSubmitButtonProps()}
            />
          </Tooltip>
        ) : (
            <Tooltip placement="top" label="Editar" hasArrow>
              <IconButton size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
            </Tooltip>
        )}

        {!isEditing && <Tooltip placement="top" label="Eliminar" hasArrow>
          <IconButton mx={1} onClick={() => {
            removeOptativa(optativa.id);
          }} icon={<SmallCloseIcon />} size="sm" />
        </Tooltip>}
      </>
    );
  }

  return (
    <Collapse in={logged && !loadingGraph} position="relative">
      <Flex
        alignItems="center"
        bg={useColorModeValue("headerbg", "headerbgdark")}
        key={user.carrera?.id}
      >
        <Box>
          <Popover placement="top" trigger="hover">
            <LightMode>
              <PopoverTrigger>
                <Box w="14ch">
                  <Stat p="0.4em" color="white" size="sm">
                    <StatLabel>
                      Créditos
                      <Badge
                        ml={"4px"}
                        colorScheme="green"
                        variant="outline"
                      >
                        {Math.round(
                          (stats.creditosTotales / user.carrera?.creditos.total) * 100
                        ) + "%"}
                      </Badge>
                    </StatLabel>
                    <StatNumber>
                      {stats.creditosTotales + " de " + user.carrera?.creditos.total}
                    </StatNumber>
                  </Stat>
                </Box>
              </PopoverTrigger>
            </LightMode>
            <PopoverContent borderColor="electivas.500" width="fit-content">
              <PopoverArrow bg="electivas.500" />
              <PopoverHeader border="none">
                <Flex>
                  <Tooltip
                    placement="top"
                    hasArrow
                    label={
                      <>
                        <Text>Los créditos por fuera del plan contabilizan como materias electivas y no influyen en el promedio.</Text>
                        <Text>Pueden ser materias optativas (materias dadas en otra facultad o carrera), cursos de posgrado, o créditos otorgados por cualquier otro motivo que la curricular avale.</Text>
                      </>
                    }
                  >
                    <Text mr={4} alignSelf="center"><strong>Créditos por fuera del plan</strong></Text>
                  </Tooltip>

                  <Tooltip
                    placement="top"
                    hasArrow
                    label="Agregar créditos"
                  >
                    <PlusSquareIcon boxSize={5} alignSelf="center" color={useColorModeValue("electivas.600", "electivas.400")} cursor="pointer" onClick={() => {
                      addOptativa("Materia Optativa", 4);
                    }} />
                  </Tooltip>
                </Flex>

              </PopoverHeader>

              <PopoverBody>
                {optativas.length > 0 && (
                  <>
                    {optativas.map((o) => (
                      <Editable
                        key={o.id}
                        m={2}
                        textAlign="left"
                        defaultValue={o.nombre}
                        isPreviewFocusable={false}
                        submitOnBlur={false}
                        onSubmit={(nombre) =>
                          editOptativa(o.id, nombre, o.creditos)
                        }
                      >
                        <Flex>
                          <Tooltip placement="top" label="Motivo" hasArrow>
                            <EditablePreview width="70%" pl={2} mr={2} />
                          </Tooltip>
                          <Tooltip placement="top" label="Motivo" hasArrow>
                            <EditableInput width="70%" pl={2} mr={2} />
                          </Tooltip>
                          <EditableControls
                            optativa={o}
                            defaultValue={o.creditos}
                          />
                        </Flex>
                      </Editable>
                    ))}
                  </>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
        <Grid
          flexGrow={1}
          columns={creditos.length}
          templateColumns="repeat(10, 1fr)"
        >
          {creditos.map((c) => (
            <GridItem colSpan={c.proportion} key={c.nombre}>
              <Popover placement="top" trigger="hover">
                <LightMode>
                  <PopoverTrigger>
                    <Box>
                      <Flex mb={1} mx={1} height={5}>
                        {c.creditos >= c.creditosNecesarios ? (
                          <Icon
                            alignSelf="center"
                            boxSize={5}
                            viewBox="0 0 640 512"
                          >
                            <path
                              fill={c.bg}
                              d="M622.34 153.2L343.4 67.5c-15.2-4.67-31.6-4.67-46.79 0L17.66 153.2c-23.54 7.23-23.54 38.36 0 45.59l48.63 14.94c-10.67 13.19-17.23 29.28-17.88 46.9C38.78 266.15 32 276.11 32 288c0 10.78 5.68 19.85 13.86 25.65L20.33 428.53C18.11 438.52 25.71 448 35.94 448h56.11c10.24 0 17.84-9.48 15.62-19.47L82.14 313.65C90.32 307.85 96 298.78 96 288c0-11.57-6.47-21.25-15.66-26.87.76-15.02 8.44-28.3 20.69-36.72L296.6 284.5c9.06 2.78 26.44 6.25 46.79 0l278.95-85.7c23.55-7.24 23.55-38.36 0-45.6zM352.79 315.09c-28.53 8.76-52.84 3.92-65.59 0l-145.02-44.55L128 384c0 35.35 85.96 64 192 64s192-28.65 192-64l-14.18-113.47-145.03 44.56z"
                            />
                          </Icon>
                        ) : (
                          <Badge
                            alignSelf={
                              c.creditosNecesarios &&
                              c.creditos !== 0 &&
                              "baseline"
                            }
                            colorScheme={c.color}
                            variant="solid"
                          >
                            {c.creditosNecesarios &&
                              c.creditos !== 0 &&
                              (Math.round(
                                (c.creditos / c.creditosNecesarios) * 100
                              ) || 0) + "%"}
                          </Badge>
                        )}
                        {!mobile && (
                          <Badge
                            fontSize="x-small"
                            ml={1}
                            colorScheme={"whiteAlpha"}
                            variant="solid"
                            alignSelf="center"
                          >
                            {c.nombrecorto}
                          </Badge>
                        )}
                      </Flex>
                      <Progress
                        hasStripe
                        height={4}
                        css={{
                          backgroundColor: c.bg,
                        }}
                        max={c.creditosNecesarios}
                        value={c.creditos}
                        colorScheme={c.color}
                      />
                    </Box>
                  </PopoverTrigger>
                </LightMode>
                <PopoverContent borderColor="electivas.500">
                  <PopoverArrow bg="electivas.500" />
                  <PopoverHeader border="none">
                    <Text><strong>{c.nombre}</strong></Text>
                    <Text>{c.nmaterias > 1 && <strong>({c.nmaterias} aprobadas)</strong>}</Text>
                  </PopoverHeader>
                  <PopoverBody>
                    {c.checkbox ? (
                      <LightMode>
                        <Checkbox
                          isIndeterminate={!!!c.check}
                          isChecked={!!c.check}
                          colorScheme={c.color}
                          onChange={(e) => {
                            e.preventDefault();
                            toggleCheckbox(c.nombre);
                          }}
                        >
                          Marcar como completo
                        </Checkbox>
                      </LightMode>
                    ) : c.creditosNecesarios ? (
                      `${c.creditos} de ${c.creditosNecesarios} créditos necesarios`
                    ) : (
                      `Tenés ${c.creditos} créditos.
                      Elegí ${user.carrera.eligeOrientaciones &&
                        !user.orientacion
                        ? "orientación"
                        : ""
                      }${user.carrera.eligeOrientaciones &&
                        !user.orientacion &&
                        !user.finDeCarrera
                        ? " y "
                        : ""
                      }${!user.finDeCarrera ? "entre tesis y tpp" : ""
                      } para saber cuantos necesitás`
                    )}
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </GridItem>
          ))}
        </Grid>

        <Popover placement="top" trigger="hover">
          <LightMode>
            <PopoverTrigger>
              <Box w="12ch">
                <Stat p="0.4em" color="white" size="sm" textAlign="right">
                  <StatLabel>Promedio</StatLabel>
                  <StatNumber>{promedio}</StatNumber>
                </Stat>
              </Box>
            </PopoverTrigger>
          </LightMode>
          <PopoverContent borderColor="electivas.500">
            <PopoverArrow bg="electivas.500" />
            <PopoverBody>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="md">
                  <strong>
                    Promedio con
                    <PinInput
                      type="number"
                      onChange={(v) => setAplazos(parseFloat(v || 0))}
                      value={aplazos.toString()}
                      size="md"
                      variant="flushed"
                    >
                      <PinInputField borderColor="red.500" />
                    </PinInput>
                    aplazos
                  </strong>
                </Text>
                <Text fontSize="md">{promedioConAplazos(aplazos)}</Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="md">
                  <strong>Promedio con CBC</strong>
                </Text>
                <Text fontSize="md">{promedioConCBC()}</Text>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Collapse>
  );
};

export default Footer;
