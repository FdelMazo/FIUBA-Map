// Valida los jsons de src/data:
// - que cada materia tenga los campos obligatorios
// - que no haya ids duplicados
// - que toda correlativa declarada exista como materia en el mismo plan
// - que no haya ciclos en el grafo de correlativas
//
// Uso: node scripts/validate-data.mjs [archivos...]
// (sin argumentos, valida todos los jsons de src/data)

import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const DATA_DIR = new URL("../src/data/", import.meta.url).pathname;

const files =
  process.argv.length > 2
    ? process.argv.slice(2)
    : readdirSync(DATA_DIR)
        .filter((f) => f.endsWith(".json"))
        .map((f) => join(DATA_DIR, f));

const validate = (materias) => {
  const errors = [];

  if (!Array.isArray(materias)) return ["el json no es un array de materias"];

  // Campos obligatorios y tipos
  materias.forEach((m, i) => {
    const where = m?.id ? `"${m.id}"` : `#${i}`;
    if (typeof m.id !== "string" || !m.id)
      errors.push(`materia ${where}: falta "id"`);
    if (typeof m.materia !== "string" || !m.materia)
      errors.push(`materia ${where}: falta "materia"`);
    if (typeof m.creditos !== "number")
      errors.push(`materia ${where}: "creditos" no es un número`);
    if (typeof m.categoria !== "string" || !m.categoria)
      errors.push(`materia ${where}: falta "categoria"`);
    if (m.level !== undefined && typeof m.level !== "number")
      errors.push(`materia ${where}: "level" no es un número`);
    if (m.correlativas !== undefined && typeof m.correlativas !== "string")
      errors.push(`materia ${where}: "correlativas" no es un string`);
    if (m.requiere !== undefined && typeof m.requiere !== "number")
      errors.push(`materia ${where}: "requiere" no es un número`);
  });

  // Ids duplicados
  const ids = new Set();
  materias.forEach((m) => {
    if (ids.has(m.id)) errors.push(`id duplicado: "${m.id}"`);
    ids.add(m.id);
  });

  // Aristas: toda correlativa tiene que existir
  const adj = new Map(); // correlativa -> [materias que la requieren]
  materias.forEach((m) => adj.set(m.id, []));
  materias.forEach((m) => {
    if (typeof m.correlativas !== "string") return;
    const correlativas = m.correlativas.split("-");
    const seen = new Set();
    correlativas.forEach((c) => {
      if (c !== c.trim() || c === "") {
        errors.push(
          `materia "${m.id}": correlativa mal formada en "${m.correlativas}"`,
        );
        return;
      }
      if (seen.has(c))
        errors.push(`materia "${m.id}": correlativa "${c}" repetida`);
      seen.add(c);
      if (c === m.id) {
        errors.push(`materia "${m.id}": es correlativa de sí misma`);
        return;
      }
      if (!ids.has(c)) {
        errors.push(`materia "${m.id}": la correlativa "${c}" no existe`);
        return;
      }
      adj.get(c).push(m.id);
    });
  });

  // Ciclos: DFS con colores, reportando el camino del ciclo
  const WHITE = 0,
    GRAY = 1,
    BLACK = 2;
  const color = new Map([...adj.keys()].map((k) => [k, WHITE]));
  const stack = [];
  const cycles = new Set();
  const dfs = (u) => {
    color.set(u, GRAY);
    stack.push(u);
    for (const v of adj.get(u)) {
      if (color.get(v) === GRAY) {
        const cycle = [...stack.slice(stack.indexOf(v)), v].join(" -> ");
        cycles.add(cycle);
      } else if (color.get(v) === WHITE) dfs(v);
    }
    stack.pop();
    color.set(u, BLACK);
  };
  for (const k of adj.keys()) if (color.get(k) === WHITE) dfs(k);
  cycles.forEach((c) => errors.push(`ciclo de correlativas: ${c}`));

  return errors;
};

let failed = false;
for (const file of files) {
  const name = relative(process.cwd(), file);
  let errors;
  try {
    errors = validate(JSON.parse(readFileSync(file, "utf8")));
  } catch (e) {
    errors = [`json inválido: ${e.message}`];
  }
  if (errors.length) {
    failed = true;
    console.error(`✗ ${name}`);
    errors.forEach((e) => console.error(`    ${e}`));
  } else {
    console.log(`✓ ${name}`);
  }
}

process.exit(failed ? 1 : 0);
