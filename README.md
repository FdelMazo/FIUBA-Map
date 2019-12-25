# [FIUBA Map](https://fdelmazo.github.io/FIUBA-Map/)

Mapa de materias y sus correlativas de la Facultad de Ingeniería

---

La idea de este proyecto es presentar de una manera interactiva y visualmente rica en información el plan de estudios de las carreras de la Facultad de Ingeniería, Universidad de Buenos Aires, para saber que materias se pueden cursar, cuantos créditos se tienen actualmente y demás.

<a href='https://imgur.com/QkXbwFc'><img src='fmap.png'></a>

Features:

* Tiene todas las carreras que se dan en la Facultad de Ingeniería, en sus respectivos últimos planes de estudio.

* Todas las carreras incluyen todas las materias electivas y todas las materias de sus respectivas orientaciones.

* Base de datos! De querer guardar la información cuatrimestre a cuatrimestre, uno puede marcar todas las materias que aprobó y agregar su padrón (o cualquier clave) y la información se va a guardar para la próxima vez que entre.

* Soporta un 'historial' de cuatrimestres, para ver el progreso en la carrera o poder planear cuatrimestres a futuro. El cuatrimestre se puede cambiar con las flechas, o con las teclas de retroceder y avanzar página.

* Calcular el Promedio! Cuando se clickea una materia para marcarla como aprobada, también sale un menu donde se puede poner la nota con la que se aprobó, y después con eso se calcula el promedio.

* Poner materias en final! Para no olvidarse los finales colgados

---
 
No hay que olvidar concatenar los `.js` del directorio `js`, sea para desarrollo local o para subir una versión nueva. Esto se hace llamando a `cat js/* > scripts.min.js` (cuando se esta desarrollando) o `cat js/* | minify -o scripts.min.js` para un despliegue. Minify se instala con `npm install babel-minify -g`.