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
        'nivel' # Jerarquía del grafo: Primero el CBC, después las obligatorias del primer cuatrimestre, etc
]

MATERIAS_HARDCODEADAS = [
    ['CBC', 'Ciclo Básico Común', '0', None, 'CBC', 0],
    # ['75.00', 'Tesis', '12', None, 'Materias Obligatorias', 10],
    # ['71.40', 'Legislación y Ejercicio Profesional de la Ingeniería en Informática', '4', None, 'Materias Obligatorias', 9],
    # ['75.99', 'Trabajo Profesional', '6', None, 'Materias Obligatorias', 9],
    # ['75.61', 'Taller de Programación III', '6', '66.74-75.74', 'Sistemas Distribuidos', 8]
]

MATERIAS_BANLIST = [
    'Electivas'
]

GRUPOS = [
    ['TERCER CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 1],
    ['CUARTO CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 2],
    ['QUINTO CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 3],
    ['SEXTO CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 4],
    ['SEPTIMO CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 5],
    ['OCTAVO CUATRIMESTRE', 'TOTAL', 'Materias Obligatorias', 6],
    ['ORIENTACION EN GESTION INDUSTRIAL DE SISTEMAS', 'OPCION TESIS DE INGENIERIA EN INFORMATICA', 'Gestion Industrial de Sistemas', 8],
    ['ORIENTACION EN SISTEMAS DISTRIBUIDOS', 'OPCION TESIS DE INGENIERIA EN INFORMATICA', 'Sistemas Distribuidos', 8],
    ['ORIENTACION EN SISTEMAS DE PRODUCCION', 'OPCION TESIS DE INGENIERIA EN INFORMATICA', 'Sistemas de Producción', 8],
    ['ASIGNATURAS ELECTIVAS', 'ASIGNATURAS DE OTRAS FACULTADES', 'Materias Electivas', 7],


]

MATERIA_OBLIGATORIA = r'(\d\d\.\d\d\n.*\n.*\n.*\n.*)'
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

    # asignaturas = []



    # asignaturas_clean = []

    # for a in asignaturas:
    #     asignatura_clean = []
    #     for x in a:
    #         if discard and a.index(x) in discard: continue
    #         if x=='140 créditos aprobados' or x=='140 créditos': x='140'
    #         asignatura_clean.append(x.replace('\n','').replace(' (*)','').strip())
    #     asignaturas_clean.append(tuple([*asignatura_clean,grupo,nivel_en_grafo]))
        
    # ASIGNATURAS.extend(asignaturas_clean)

    # ASIGNATURAS = [a for a in ASIGNATURAS if not a[3] == 'continúa']
    # return materiasx


# def materias(filename, texto_entero, grupo, nivel_en_grafo, start, end=None, fields=5, discard=[3]):
#     ASIGNATURAS = []
#     if end: asignaturas = texto_entero[texto_entero.find(start)+len(start):texto_entero.find(end,texto_entero.find(start))]
#     else: asignaturas = texto_entero[texto_entero.find(start)+len(start):]

#     parrafos = asignaturas.split('\n')
#     for i,p in enumerate(parrafos):
#         if CODIGO.search(p):
#             parrafos = parrafos[i:]
#             break

#     asignaturas = []

#     for i,p in enumerate(parrafos):
#         if CODIGO.search(p):
#             asignaturas.append(parrafos[i:i+fields])
#             for j in range(i,i+fields): parrafos[j] = ''

#     asignaturas_clean = []

#     for a in asignaturas:
#         asignatura_clean = []
#         for x in a:
#             if discard and a.index(x) in discard: continue
#             if x=='140 créditos aprobados' or x=='140 créditos': x='140'
#             asignatura_clean.append(x.replace('\n','').replace(' (*)','').strip())
#         asignaturas_clean.append(tuple([*asignatura_clean,grupo,nivel_en_grafo]))
        
#     ASIGNATURAS.extend(asignaturas_clean)

#     ASIGNATURAS = [a for a in ASIGNATURAS if not a[3] == 'continúa']

#     with open(filename, 'a') as f:
#         wr = csv.writer(f)
#         wr.writerows(ASIGNATURAS)

def main():
    texto_entero = parsePDF(sys.argv[1])
    lineas = [*MATERIAS_HARDCODEADAS]

    for grupo in GRUPOS:
        desde, hasta, titulo_grupo, nivel_en_grafo = grupo
        expresion = MATERIA_ELECTIVA if 'Electivas' in titulo_grupo else MATERIA_OBLIGATORIA
        materias = obtener_materias(texto_entero, desde, hasta, expresion)
        materias_parseadas = parse_materias(materias)
        for m in materias_parseadas:
            codigo, titulo, creditos, correlativas = m
            lineas.append((codigo, titulo, creditos, correlativas, titulo_grupo, nivel_en_grafo))

    base = os.path.splitext(sys.argv[1])[0]
    filename = base+'.csv'
       
    with open(filename, 'w') as f:
        wr = csv.writer(f)
        wr.writerow(HEADER)
        for linea in lineas: wr.writerow(linea)

        # wr.writerow(['140', ' 140 créditos aprobados','0','CBC','xx','9'])
#         wr.writerow(['71.40', 'Legislación y Ejercicio Profesional de la Ingeniería en Informática','4','140','xxx','10'])
#         wr.writerow(['75.00', 'Tesis','12','71.40','Opción Tesis','11'])
#         wr.writerow(['75.99', 'Trabajo Profesional','6','71.40','Opción Trabajo Profesional','11'])


    

#     materias(filename, texto_entero, 'Materias Obligatorias', 2, 'CUARTO CUATRIMESTRE','QUINTO CUATRIMESTRE')
#     materias(filename, texto_entero, 'Materias Obligatorias', 3, 'QUINTO CUATRIMESTRE','SEXTO CUATRIMESTRE')
#     materias(filename, texto_entero, 'Materias Obligatorias', 4, 'SEXTO CUATRIMESTRE','SEPTIMO CUATRIMESTRE')
#     materias(filename, texto_entero, 'Materias Obligatorias', 5, 'SEPTIMO CUATRIMESTRE','OCTAVO CUATRIMESTRE')
#     materias(filename, texto_entero, 'Materias Obligatorias', 6, 'OCTAVO CUATRIMESTRE','ORIENTACION EN')
#     materias(filename, texto_entero, 'Materias Electivas', 7, 'ASIGNATURAS ELECTIVAS',fields=4,discard=[])

main()
