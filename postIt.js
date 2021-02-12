const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function loadDraw(){
    ctx.strokeRect(10,10,100,100);
}

function init(){
    loadDraw()
}

init();