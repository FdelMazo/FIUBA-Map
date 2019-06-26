# [FIUBA Map](https://fdelmazo.github.io/FIUBA-Map/)

Mapa de materias y sus correlativas de la Facultad de Ingeniería

---

La idea de este proyecto es presentar de una manera interactiva y visualmente rica en información el plan de estudios de las carreras de la Facultad de Ingeniería, Universidad de Buenos Aires, para saber que materias se pueden cursar, cuantos créditos se tienen actualmente y demás.

![](example.png)

El proceso para agregar una carrera es:

* Descargar el PDF con el plan de estudios de la pagina de [FIUBA](http://www.fi.uba.ar/es/grado)

* Pseudo procesar el PDF con [pdfToCSV.py](data/pdfToCSV.py): este script de Python *intenta* agarrar todo el texto del PDF recibido que contenga información de las materias, y convertirlo en un CSV. Pero como los PDFs que proporciona la facultad no son todos iguales, es muy dificil automatizar este proceso. Es por esto que siempre después de correr el script, hay que verificar manualmente que los valores del CSV correspondan al plan.

* Agregar en el menu de [index.html](index.hml) la carrera

* Agregar la carrera en el switch de [carreras.js](carreras.js)

Después, [fiuba-map.js](fiuba-map.js) parsea el CSV y lo convierte en una Network de [vis.js](https://visjs.org/docs/network/)