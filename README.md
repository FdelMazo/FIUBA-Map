# [FIUBA Map](https://fdelmazo.github.io/FIUBA-Map/)

Mapa de materias y sus correlativas de la Facultad de Ingeniería

---

La idea de este proyecto es presentar de una manera interactiva y visualmente rica en información el plan de estudios de las carreras de la Facultad de Ingeniería, Universidad de Buenos Aires, para saber que materias se pueden cursar, cuantos créditos se tienen actualmente y demás.

<a href='https://imgur.com/QkXbwFc'><img src='https://i.imgur.com/QkXbwFch.gif'></a>

El proceso para agregar una carrera es:

* Descargar el PDF con el plan de estudios de la pagina de [FIUBA](http://www.fi.uba.ar/es/grado)

* Pseudo procesar el PDF con [pdfToCSV.py](pdfToCSV.py): este script de Python *intenta* agarrar todo el texto del PDF recibido que contenga información de las materias, y convertirlo en un CSV. Pero como los PDFs que proporciona la facultad no son todos iguales, es muy dificil automatizar este proceso. Es por esto que siempre después de correr el script, hay que verificar manualmente que los valores del CSV correspondan al plan.

* Agregar en el menu de [index.html](index.html) la carrera

* Agregar la carrera en el switch de [main.js](js/main.js)

Después, se parsea el CSV y lo convierte en una Network de [vis.js](https://visjs.org/docs/network/)

---
 
No hay que olvidar concatenar los `.js` del directorio `js`, sea para desarrollo local o para subir una versión nueva. Esto se hace llamando a `cat js/* > scripts.min.js` (cuando se esta desarrollando) o `cat js/* | minify -o scripts.min.js` para un despliegue. Minify se instala con `npm install babel-minify -g`.