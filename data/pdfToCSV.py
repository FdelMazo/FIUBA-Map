#! /usr/bin/env python3
import PyPDF2
import sys
import re
import os
import csv

CODIGO = re.compile(r'^\d\d\.\d\d*$')

def parsePDF(f):
    pdfFileObj = open(f, 'rb')
    pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
    wholeText = ''
    for page in pdfReader.pages:
        texto = page.extractText()
        parrafos = texto.split('\n \n')
        parrafos = [p.replace('\n','').strip() for p in parrafos]
        wholeText+='\n'.join(parrafos)
        wholeText = wholeText.replace('\n-\n','-')
    return wholeText

def materias(filename, wholeText, categoria, nivel_en_grafo, start, end=None, fields=5, discard=[3]):
    ASIGNATURAS = []
    if end: asignaturas = wholeText[wholeText.find(start)+len(start):wholeText.find(end,wholeText.find(start))]
    else: asignaturas = wholeText[wholeText.find(start)+len(start):]

    parrafos = asignaturas.split('\n')
    for i,p in enumerate(parrafos):
        if CODIGO.search(p):
            parrafos = parrafos[i:]
            break

    asignaturas = []

    for i,p in enumerate(parrafos):
        if CODIGO.search(p):
            asignaturas.append(parrafos[i:i+fields])
            for j in range(i,i+fields): parrafos[j] = ''

    asignaturas_clean = []

    for a in asignaturas:
        asignatura_clean = []
        for x in a:
            if discard and a.index(x) in discard: continue
            if x=='140 créditos aprobados' or x=='140 créditos': x='140'
            asignatura_clean.append(x.replace('\n','').replace(' (*)','').strip())
        asignaturas_clean.append(tuple([*asignatura_clean,categoria,nivel_en_grafo]))
        
    ASIGNATURAS.extend(asignaturas_clean)

    ASIGNATURAS = [a for a in ASIGNATURAS if not a[3] == 'continúa']

    with open(filename, 'a') as f:
        wr = csv.writer(f)
        wr.writerows(ASIGNATURAS)

def main():
    wholeText = parsePDF(sys.argv[1])
    base = os.path.splitext(sys.argv[1])[0]
    filename = base+'.csv'
    
    with open(filename, 'w') as f:
        wr = csv.writer(f)
        wr.writerow(['codigo', 'materia','creditos','correlativas','categoria','nivel_en_grafo'])
        wr.writerow(['CBC', 'Ciclo Básico Común','0','x','Ciclo Básico Común','0'])
        wr.writerow(['140', '140 créditos  aprobados','0','CBC','xx','9'])

        wr.writerow(['71.40', 'Legislación y Ejercicio Profesional de la Ingeniería en Informática','4','140','xxx','10'])
        wr.writerow(['75.00', 'Tesis','12','71.40','Opción Tesis','11'])
        wr.writerow(['75.99', 'Trabajo Profesional','6','71.40','Opción Trabajo Profesional','11'])

    materias(filename, wholeText, 'Materias Obligatorias', 1, 'TERCER CUATRIMESTRE','CUARTO CUATRIMESTRE')
    materias(filename, wholeText, 'Materias Obligatorias', 2, 'CUARTO CUATRIMESTRE','QUINTO CUATRIMESTRE')
    materias(filename, wholeText, 'Materias Obligatorias', 3, 'QUINTO CUATRIMESTRE','SEXTO CUATRIMESTRE')
    materias(filename, wholeText, 'Materias Obligatorias', 4, 'SEXTO CUATRIMESTRE','SEPTIMO CUATRIMESTRE')
    materias(filename, wholeText, 'Materias Obligatorias', 5, 'SEPTIMO CUATRIMESTRE','OCTAVO CUATRIMESTRE')
    materias(filename, wholeText, 'Materias Obligatorias', 6, 'OCTAVO CUATRIMESTRE','ORIENTACION EN')
    materias(filename, wholeText, 'Materias Electivas', 7, 'ASIGNATURAS ELECTIVAS',fields=4,discard=[])
    materias(filename, wholeText, 'Orientacion: Gestión Industrial de Sistemas', 8, 'ORIENTACION EN GESTION INDUSTRIAL DE SISTEMAS', 'OPCION TESIS')
    materias(filename, wholeText, 'Orientacion: Sistemas Distribuidos', 8, 'ORIENTACION EN SISTEMAS DISTRIBUIDOS', 'OPCION TESIS')
    materias(filename, wholeText, 'Orientacion: Sistemas de Producción', 8, 'ORIENTACION EN SISTEMAS DE PRODUCCION', 'OPCION TESIS')

main()
