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

def materias(filename, categoria, wholeText, start, end=None, fields=5, discard=[3]):
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
            asignaturas.append(tuple(parrafos[i:i+fields]))
            for j in range(i,i+fields): parrafos[j] = ''

    asignaturas_clean = []

    for a in asignaturas:
        asignatura_clean = []
        for x in a:
            if discard and a.index(x) in discard: continue
            asignatura_clean.append(x.replace('\n','').replace(' (*)','').strip())
        asignaturas_clean.append(tuple([*asignatura_clean,categoria]))
        
    ASIGNATURAS.extend(asignaturas_clean)

    ASIGNATURAS = [a for a in ASIGNATURAS if not a[3] == 'continúa']

    for a in ASIGNATURAS:
        assert(len(a)==5)

    with open(filename, 'a') as f:
        wr = csv.writer(f)
        wr.writerows(ASIGNATURAS)

def main():
    wholeText = parsePDF(sys.argv[1])
    base = os.path.splitext(sys.argv[1])[0]
    filename = base+'.csv'
    
    with open(filename, 'w') as f:
        wr = csv.writer(f)
        wr.writerow(['codigo', 'materia','creditos','correlativas','categoria'])
        wr.writerow(['CBC', 'Ciclo Básico Común','0',' ','Ciclo Básico Común'])
        wr.writerow(['75.61', 'Taller de Programación III','6','66.74-75.74','Orientacion: Gestion Industrial de Sistemas (opción tesis)']) #Caso muuuuy particular


    materias(filename, 'Materias Obligatorias',wholeText, 'DISTRIBUCION DE ASIGNATURAS','ORIENTACION')
    materias(filename, 'Materias Electivas',wholeText, 'ASIGNATURAS ELECTIVAS','78.01',fields=4,discard=[])
    materias(filename, 'Idiomas',wholeText, 'Idioma Inglés','Solo se tendrá',fields=4,discard=[])
    materias(filename, 'Orientacion: Gestión Industrial de Sistemas',wholeText, 'ORIENTACION EN GESTION INDUSTRIAL DE SISTEMAS', 'OPCION TESIS')
    materias(filename, 'Orientacion: Sistemas Distribuidos',wholeText, 'ORIENTACION EN SISTEMAS DISTRIBUIDOS', 'OPCION TESIS')
    materias(filename, 'Orientacion: Sistemas de Producción',wholeText, 'ORIENTACION EN SISTEMAS DE PRODUCCION', 'OPCION TESIS')
    materias(filename, 'Opción Tésis',wholeText, 'OPCION TESIS DE INGENIERIA EN INFORMATICA', 'OPCION TRABAJO PROFESIONAL DE INGENIERIA EN INFORMATICA')
    materias(filename, 'Opción Trabajo Profesional',wholeText, 'OPCION TRABAJO PROFESIONAL DE INGENIERIA EN INFORMATICA', 'TOTAL DE LA CARRERA (CBC + SEGUNDO CICLO)')    

main()
