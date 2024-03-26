export const promediar = (materias) => {
  const sum = materias.reduce((acc, node) => {
    acc += node.nota;
    return acc;
  }, 0);
  return sum ? (sum / materias.length).toFixed(2) : 0;
};

// quiza cambiar estas funciones de accNombre a acreditarNombre o sumNombre?, me parece que serian mas informativos
export const accCreditos = (acc, node) => {
  acc += node.creditos;
  return acc;
};

export const accCreditosNecesarios = (acc, grupo) => {
  acc += grupo.creditosNecesarios;
  return acc;
};

export const accProportion = (acc, grupo) => {
  acc += grupo.proportion;
  return acc;
};

export const getCurrentCuatri = () => {
  const today = new Date();
  let cuatri = today.getFullYear();
  const month = today.getMonth();
  // recordemos que el month esta 0-indexed
  // 1C entre marzo (2) y julio (6)
  // 2C entre agosto (7) y febrero (1)
  if (month < 2) cuatri = cuatri - 0.5;
  else if (month > 6) cuatri = cuatri + 0.5;
  return cuatri;
};
