import * as data from "./data";
import { COLORS } from "./theme";

export const CARRERAS = [
  {
    id: "sistemas",
    graph: data.sistemas,
    nombre: "Licenciatura en Análisis de Sistemas",
    creditos: {
      obligatorias: 136,
      electivas: 28,
      checkbox: [
        {
          nombre: "Idioma Inglés",
          bg: COLORS.enfinal[50],
          color: "enfinal",
        },
      ],
      materias: [
        { id: "95.61", bg: COLORS.findecarrera[50], color: "findecarrera" },
      ],
    },
  },
  {
    id: "informatica",
    graph: data.informatica,
    nombre: "Ingeniería en Informática",
    orientaciones: [
      {
        nombre: "Gestión Industrial de Sistemas",
        color: COLORS.orientacion1[500],
      },
      { nombre: "Sistemas Distribuidos", color: COLORS.orientacion2[500] },
      { nombre: "Sistemas de Producción", color: COLORS.orientacion3[500] },
    ],
    finDeCarrera: [
      { id: "tesis", materia: "75.00" },
      { id: "tpp", materia: "75.99" },
    ],
    creditos: {
      obligatorias: 156,
      orientacion: { tesis: 34, tpp: 34 },
      electivas: { tesis: 34, tpp: 46 },
    },
    eligeOrientaciones: true,
  },
  {
    id: "agrimensura",
    graph: data.agrimensura,
    nombre: "Ingeniería en Agrimensura",
    finDeCarrera: [
      { id: "tesis", materia: "70.00" },
      { id: "tpp", materia: "70.99" },
    ],
    creditos: {
      obligatorias: 178,
      checkbox: [
        {
          nombre: "Estadía Supervisada de al menos 200 horas",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
      ],
      electivas: { tesis: 12, tpp: 18 },
    },
  },
  {
    id: "alimentos",
    graph: data.alimentos,
    nombre: "Ingeniería de Alimentos",
    creditos: {
      materias: [
        {
          id: "76.44",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
        { id: "76.90", bg: COLORS.findecarrera[50], color: "findecarrera" },
      ],
      obligatorias: 118,
      electivas: 10,
    },
  },
  {
    id: "civil",
    graph: data.civil,
    nombre: "Ingeniería Civil",
    creditos: {
      obligatorias: 210,
      electivas: 34,
      materias: [
        { id: "84.99", bg: COLORS.findecarrera[50], color: "findecarrera" },
      ],
      checkbox: [
        {
          nombre: "Estadía Supervisada de al menos 200 horas",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
        { nombre: "Idioma Inglés", bg: COLORS.enfinal[50], color: "enfinal" },
      ],
    },
  },
  {
    id: "electricista",
    graph: data.electricista,
    nombre: "Ingeniería Electricista",
    finDeCarrera: [
      { id: "tesis", materia: "85.00" },
      { id: "tpp", materia: "85.99" },
    ],
    creditos: {
      obligatorias: 206,
      checkbox: [
        {
          nombre: "Estadía Supervisada de al menos 200 horas",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
        { nombre: "Idioma Inglés", bg: COLORS.enfinal[50], color: "enfinal" },
      ],
      electivas: { tesis: 16, tpp: 22 },
    },
  },
  {
    id: "electronica",
    graph: data.electronica,
    nombre: "Ingeniería Electrónica",
    orientaciones: [
      { nombre: "Multiples Orientaciones", color: COLORS.orientacion0[500] },
      { nombre: "Procesamiento de Señales", color: COLORS.orientacion1[500] },
      { nombre: "Automatización y Control", color: COLORS.orientacion2[500] },
      { nombre: "Física Electrónica", color: COLORS.orientacion3[500] },
      { nombre: "Telecomunicaciones", color: COLORS.orientacion4[500] },
      {
        nombre: "Sistemas Digitales y Computación",
        color: COLORS.orientacion5[500],
      },
      { nombre: "Multimedia", color: COLORS.orientacion6[500] },
      { nombre: "Instrumentación Biomédica", color: COLORS.orientacion7[500] },
    ],
    finDeCarrera: [
      { id: "tesis", materia: "86.00" },
      { id: "tpp", materia: "86.99" },
    ],
    creditos: {
      obligatorias: 166,
      electivas: 56,
      checkbox: [
        {
          nombre: "Práctica  Profesional",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
        { nombre: "Idioma Inglés", bg: COLORS.enfinal[50], color: "enfinal" },
      ],
    },
  },
  {
    id: "industrial",
    graph: data.industrial,
    nombre: "Ingeniería Industrial",
    finDeCarrera: [
      { id: "tesis", materia: "92.00" },
      { id: "tpp", materia: "92.99" },
    ],
    creditos: {
      obligatorias: 196,
      materias: [
        { id: "HUM", bg: COLORS.orientacion1[50], color: "orientacion1" },
      ],
      checkbox: [
        {
          nombre: "Práctica Profesional de al menos 200 horas",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
        { nombre: "Idioma Inglés", bg: COLORS.enfinal[50], color: "enfinal" },
      ],
      electivas: { tesis: 32, tpp: 32 },
    },
  },
  {
    id: "mecanica",
    graph: data.mecanica,
    nombre: "Ingeniería Mecánica",
    orientaciones: [
      { nombre: "Diseño Mecánico", color: COLORS.orientacion1[500] },
      { nombre: "Termomecánica", color: COLORS.orientacion2[500] },
      { nombre: "Metalúrgica", color: COLORS.orientacion3[500] },
      { nombre: "Computación Aplicada", color: COLORS.orientacion4[500] },
      { nombre: "Industrias", color: COLORS.orientacion5[500] },
    ],
    eligeOrientaciones: { tesis: true },
    finDeCarrera: [
      { id: "tesis", materia: "67.00" },
      { id: "tpp", materia: "67.98" },
    ],
    creditos: {
      obligatorias: 190,
      orientacion: { tesis: 28 },
      electivas: { tesis: 24, tpp: 52 },
    },
  },
  {
    id: "naval",
    graph: data.naval,
    nombre: "Ingeniería Naval y Mecánica",
    finDeCarrera: [
      { id: "tesis", materia: "73.00" },
      { id: "tpp", materia: "73.99" },
    ],
    creditos: {
      obligatorias: 226,
      electivas: { tesis: 20, tpp: 38 },
    },
  },
  {
    id: "petroleo",
    graph: data.petroleo,
    nombre: "Ingeniería en Petróleo",
    finDeCarrera: [
      { id: "tesis", materia: "79.00" },
      { id: "tpp", materia: "79.99" },
    ],
    creditos: {
      obligatorias: 216,
      electivas: { tesis: 12, tpp: 16 },
      checkbox: [
        {
          nombre: "Práctica  Supervisada",
          bg: COLORS.habilitadas[50],
          color: "habilitadas",
        },
        { nombre: "Idioma Inglés", bg: COLORS.enfinal[50], color: "enfinal" },
      ],
    },
  },
  {
    id: "quimica",
    graph: data.quimica,
    nombre: "Ingeniería Química",
    finDeCarrera: [
      { id: "tesis", materia: "76.64" },
      { id: "tpp", materia: "76.59-76.62" },
    ],
    creditos: {
      obligatorias: 216,
      electivas: { tesis: 18, tpp: 24 },
    },
  },
];

export default CARRERAS;
