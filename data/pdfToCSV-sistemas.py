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

def materias(filename, wholeText, categoria, nivel_en_grafo, start, end=None, fields=7, discard=[3,4,6]):
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
        for i,x in enumerate(a):
            if discard and i in discard: continue
            if x=='Primer Ciclo': x='CBC'
            asignatura_clean.append(x.replace('\n','').replace(',','').replace(' (*)','').strip())
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

    materias(filename, wholeText, 'Materias Obligatorias', 1, 'Tercer Cuatrimestre','Cuarto Cuatrimestre')
    materias(filename, wholeText, 'Materias Obligatorias', 2, 'Cuarto Cuatrimestre','Quinto Cuatrimestre')
    materias(filename, wholeText, 'Materias Obligatorias', 3, 'Quinto Cuatrimestre','Sexto Cuatrimestre')
    materias(filename, wholeText, 'Materias Obligatorias', 4, 'Sexto Cuatrimestre','Séptimo Cuatrimestre')
    materias(filename, wholeText, 'Materias Obligatorias', 5, 'Séptimo Cuatrimestre','Octavo Cuatrimestre')
    materias(filename, wholeText, 'Materias Obligatorias', 6, 'Octavo Cuatrimestre','Noveno Cuatrimestre')
    materias(filename, wholeText, 'Materias Obligatorias', 9, 'Noveno Cuatrimestre','ASIGNATURAS ELECTIVAS')
    materias(filename, wholeText, 'Materias Electivas', 7, 'ASIGNATURAS ELECTIVAS',fields=6,discard=[3,4])

main()
