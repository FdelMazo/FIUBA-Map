PARTYMODE = false;
let FIBONACCIFIRST = 0;
let FIBONACCISECOND = 1;

function partyMode(nodo) {
    nodo.hidden = true;
    FIUBAMAP.MATERIAS.update(nodo);
    let counter = fibonacciCounter();
    for (let i = 0; i < counter; i++) {
        let img = document.createElement("IMG");
        img.setAttribute("src", "https://cultofthepartyparrot.com/parrots/hd/parrot.gif");
        img.setAttribute("class", "party");
        document.body.appendChild(img);
        let xy = getRandomPosition(img);
        img.style.top = xy[0] + 'px';
        img.style.left = xy[1] + 'px';
    }
}

function getRandomPosition(element) {
    let x = document.body.offsetHeight - element.clientHeight;
    let y = document.body.offsetWidth - element.clientWidth;
    let randomX = Math.floor(Math.random() * x);
    let randomY = Math.floor(Math.random() * y);
    return [randomX, randomY];
}

function fibonacciCounter() {
    let val = FIBONACCIFIRST + FIBONACCISECOND;
    FIBONACCIFIRST = FIBONACCISECOND;
    FIBONACCISECOND = val;
    return FIBONACCIFIRST + FIBONACCISECOND
}