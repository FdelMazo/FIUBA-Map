export const promediar = (materias) => {
  const sum = materias.reduce((acc, node) => {
    acc += node.nota;
    return acc;
  }, 0);
  return sum ? (sum / materias.length).toFixed(2) : 0;
};

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
  if (month > 6) cuatri = cuatri + 0.5;
  return cuatri;
}
