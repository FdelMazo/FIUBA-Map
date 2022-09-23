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

export const overrideVisJsUpdate = (network) => {
  // Copied from https://github.com/visjs/vis-network/blob/2c774997ff234fa93555f36ca8040cf4d489e5df/lib/network/modules/NodesHandler.js#L325
  // Removed the last call to body.emit(datachanged)
  network.nodesHandler.update = (ids, changedData, oldData) => {
    const nodes = network.body.nodes;
    let dataChanged = false;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let node = nodes[id];
      const data = changedData[i];
      if (node !== undefined) {
        // update node
        if (node.setOptions(data)) {
          dataChanged = true;
        }
      } else {
        dataChanged = true;
        // create node
        node = network.create(data);
        nodes[id] = node;
      }
    }

    if (!dataChanged && oldData !== undefined) {
      // Check for any changes which should trigger a layout recalculation
      // For now, this is just 'level' for hierarchical layout
      // Assumption: old and new data arranged in same order; at time of writing, this holds.
      dataChanged = changedData.some(function (newValue, index) {
        const oldValue = oldData[index];
        return oldValue && oldValue.level !== newValue.level;
      });
    }

    network.body.emitter.emit("_dataUpdated");
  }
}
