//TODO: guardo los elementos de la derecha en variables
const slider__inner = document.querySelector(".right__story");
console.log(slider__inner)
const items = document.querySelectorAll(".story__item");
//TODO: guardo los elementos de la izquierda en variables
const slider__izquierda = document.querySelector(".left__creatores")
const creatores = document.querySelectorAll(".left__creator");
console.log(slider__izquierda)

const dots = document.querySelectorAll(".right__btn_item");
const next = document.querySelector('.story__btn-next');
const prev = document.querySelector('.story__btn-prev');

//TODO: VARIABLES GLOBALES
let active = 0;//CONTADOR DE ELEMENTOS 
let lengthItems = items.length - 1; //LIMITE O LONGITUD DE ELEMENTOS

//TODO: AL ELEMENTO CAPTURADO LE AGREGO LA FUNCION ONCLICK COMO ES UN BOTON REACCIONA A DICHO EVENTO
next.onclick = function () {
    active + 1 > lengthItems ? active = 0 : active = active + 1;
    reloadSlider();
}
//TODO: AL ELEMENTO CAPTURADO LE AGREGO LA FUNCION ONCLICK COMO S UN BOTON REACIONA A DICHO EVENTO
prev.onclick = function () {
    active - 1 < 0 ? active = lengthItems : active = active - 1;
    reloadSlider();
}

//TODO: automatizacion slider
let refreshSlider = setInterval(() => { next.onclick() }, 5000);

function reloadSlider() {
    let checkLesft = active * -100;// MULTIPLICA EL CONTADOR SEGUN SU POSICION POR LA CANTIDAD DE DISTANCIA QUE QUEIRO QUE SE MUEVA MI ELEMENTO
    slider__inner.style.transform = "translateX(" + checkLesft + "%)";//HAGO QUE EL ELEMENTO TENGA ESTA POSICION
    slider__izquierda.style.transform = "translateY(" + checkLesft + "%)";

    let dotsPrev = document.querySelector('.right__btn_item.btn-active');//CAPTURO EL ELEMENTO QUE ESTE ACTIVO

    dotsPrev.classList.remove('btn-active');//BORRO EL ACTIVO DEL ELEMENTO CAPTURADO
    dots[active].classList.add('btn-active');//LE AGREGO EL ACTIVO AL ELEMENTO QUE NOS INDIQUE EL CONTADOR O INDEX

    let creatorPrev = document.querySelector('.left__creator.active-creator');

    console.log(creatorPrev)
    creatorPrev.classList.remove('active-creator');
    creatores[active].classList.add('active-creator');

    //TODO: limpiamos el intervalo cuando hacemos click  y luego lo volvemos a arrancar al no hacer click
    clearInterval(refreshSlider);
    refreshSlider = setInterval(() => { next.onclick() }, 5000)
}

//TODO: RECORO TODOS LOS DOTS QUE SON LOS CIRCULOS EN MI DOM Y ESCUCHO ADENTRO EL ELEMENTO CLICK 
dots.forEach((item, index) => {
    item.addEventListener('click', function () {
        active = index;
        reloadSlider();
    })
})



