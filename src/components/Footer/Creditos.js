import {
  CheckIcon,
  EditIcon,
  PlusSquareIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  LightMode,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useColorModeValue,
  useEditableControls,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../Contexts";

const Creditos = () => {
  const { user } = React.useContext(UserContext);
  const {
    stats,
    optativas,
    addOptativa,
    editOptativa,
    removeOptativa } = React.useContext(GraphContext);

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
            <Flex justifyContent="space-between">
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
  );
};

export default Creditos;
