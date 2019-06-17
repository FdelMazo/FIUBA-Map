#! /usr/bin/env python3
import PyPDF2
import sys
import re
import os
import csv

HEADER = ['codigo',
        'materia',
        'creditos',
        'correlativas',
        'grupo', # CBC - Obligatorias - Optativas - Idiomas - Orientaciones - Tesis - Trabajo Profesional
        'nivel', # Jerarquía del grafo: Primero el CBC, después las obligatorias del primer cuatrimestre, etc
        'caveat' # Mensaje aclarando algo en particular de las materia (por ejemplo, los idiomas se puede solo hacer uno)
]

MATERIAS_HARDCODEADAS = [
    ['CBC', 'Ciclo Básico Común', '0', None, 'CBC', 0, None],
]

MATERIAS_BANLIST = [
    'Electivas'
]

GRUPOS = [
    # ['TERCER CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 1],
    # ['CUARTO CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 2],
    # ['QUINTO CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 3],
    # ['SEXTO CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 4],
    # ['SÉPTIMO CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 5],
    # ['OCTAVO CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 6],
    # ['NOVENO CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 7],
    # ['DÉCIMO CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 8],
    ['ASIGNATURAS ELECTIVAS', 'ASIGNATURAS DE OTRAS FACULTADES', 'Materias Electivas', 9],


]

MATERIA_OBLIGATORIA = r'(\d\d\.\d\d\n.*\n.*\n.*)'
MATERIA_ELECTIVA = r'(\d\d\.\d\d\n.*\n.*\n.*)'

def parsePDF(f):
    pdfFileObj = open(f, 'rb')
    pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
    texto_entero = ''
    for page in pdfReader.pages:
        texto = page.extractText()
        parrafos = texto.split('\n \n')
        parrafos = [p.replace('\n','').strip() for p in parrafos]
        texto_entero+='\n'.join(parrafos)
        texto_entero = texto_entero.replace('\n-\n','-')
    return texto_entero

def obtener_materias(texto_entero, desde, hasta, expresion):
    indice_desde = texto_entero.find(desde)+len(desde)
    indice_hasta = texto_entero.find(hasta,indice_desde) if hasta else None
    texto_materias = texto_entero[indice_desde:indice_hasta].strip()
    materias = re.split(expresion, texto_materias) # Devuelve una lista del estilo [codigo1, materia1, codigo2, materia2]
    materias = [m.strip() for m in materias if m.strip() and re.search(expresion, m)] # Emprolija la lista
    materias = [tuple(m.split('\n')) for m in materias]
    print(materias)
    return materias

def parse_materias(materias):
    materias_parseadas = []
    for materia in materias:
        if any([m in MATERIAS_BANLIST for m in materia]): continue
        try:
            codigo, titulo, creditos, horas, correlativas = materia
        except ValueError:
            codigo, titulo, creditos, correlativas = materia
        materias_parseadas.append((codigo, titulo, creditos, correlativas))
    return materias_parseadas

def main():
    texto_entero = parsePDF(sys.argv[1])
    lineas = [*MATERIAS_HARDCODEADAS]

    for grupo in GRUPOS:
        desde, hasta, titulo_grupo, nivel_en_grafo = grupo
        expresion = MATERIA_ELECTIVA if 'ELECTIVAS' in titulo_grupo else MATERIA_OBLIGATORIA
        materias = obtener_materias(texto_entero, desde, hasta, expresion)
        materias_parseadas = parse_materias(materias)
        for m in materias_parseadas:
            codigo, titulo, creditos, correlativas = m
            lineas.append((codigo, titulo, creditos, correlativas, titulo_grupo, nivel_en_grafo, None))

    base = os.path.splitext(sys.argv[1])[0]
    filename = base+'.organizar.csv'
       
    with open(filename, 'w') as f:
        wr = csv.writer(f)
        wr.writerow(HEADER)
        for linea in lineas: wr.writerow(linea)

main()
