const form = document.querySelector(".js-form"),
    input = form.querySelector("input"),
    list = document.querySelector("ul"),
    To = document.querySelector(".to"),
    Do = document.querySelector(".do"),
    perc = document.querySelector(".perc");


let drawTodo = [];
let toDos = [];
const TODO_LS = "toDos";
const DRAW_LS = "draws"
const DRAWTODO_LS = "drawToDos"

function saveTodo(){
    localStorage.setItem(TODO_LS,JSON.stringify(toDos));
}

function saveDrawToDo(){
    localStorage.setItem(DRAWTODO_LS,JSON.stringify(drawTodo));
}

function saveDrawing(){
    localStorage.setItem(DRAW_LS,JSON.stringify(drawing));
}

function eachPaint(toDo){
    paintToDo(toDo.text,toDo.check,toDo.timeLine);
}

function eachDrawToDo(DrawToDos){
    drawTodo.push(DrawToDos)
    drawId++;
    toDoAllDraw();
}

function eachDraws(drawings){
    drawing.push(drawings)
    drawingId++;
}

function loadToDo(){
    const loadToDos = localStorage.getItem(TODO_LS);
    const loadDrawToDos = localStorage.getItem(DRAWTODO_LS);
    const loadDraws = localStorage.getItem(DRAW_LS);
    console.log(loadDraws);
    if(loadToDos !== null){
        const paintToDos = JSON.parse(loadToDos);
        paintToDos.forEach(eachPaint);
    }
    if(loadDraws !== null){
        const paintDraws = JSON.parse(loadDraws);
        paintDraws.forEach(eachDraws);
        drawingDraw();
    }
    if(loadDrawToDos !== null){
        const paintDrawToDos = JSON.parse(loadDrawToDos);
        paintDrawToDos.forEach(eachDrawToDo);
    }
    percent();
}

function del(event){
    const btn = event.target;
    const li = btn.parentNode;
    list.removeChild(li);
    const removeText = toDos.filter(function(delToDo){
        return delToDo.id !== parseInt(li.id);
    })
    console.log(removeText,"text",toDos)
    toDos = removeText;
    saveTodo();
    delDrawToDo(parseInt(li.id))
}

function delToDo(id){
    const li = document.getElementById(id)
    console.log(li);
    list.removeChild(li);
    const removeText = toDos.filter(function(delToDo){
        return delToDo.id !== id;
    })
    console.log(removeText,"text",toDos)
    toDos = removeText;
    saveTodo();
}

function clearDrawToDo(){
    ctx.clearRect(0, 0, maxX, maxY);
    drawingDraw()
    for(let i=0;i<=drawId-1;i++){
        ctx.fillStyle = drawTodo[i].boxColor
        ctx.fillRect(drawTodo[i].x,drawTodo[i].y,500,75);
        ctx.fillStyle = textColor
        ctx.fillText(drawTodo[i].text,drawTodo[i].x,drawTodo[i].y+50)
    }
}

function delDrawToDo(id){
    const removeDrawToDo = drawTodo.filter(function(delToDo){
        return delToDo.drawId !== id;
    })
    console.log(removeDrawToDo,"draw",drawTodo)
    drawTodo = removeDrawToDo;
    drawId = drawTodo.length
    clearDrawToDo()
    saveDrawToDo();
}

function success(event){
    const box=event.target;
    const li = box.parentNode;
    if(box.checked===true){
        li.classList.add("true");
        toDos[li.id].check = true;
    } else{
        li.classList.remove("true");
        toDos[li.id].check = false;
    }
    saveTodo();
}

function percent(){
    const toDo = toDos.length;
    let i=0;
    let successToDo=0;
    for(i=0;i<toDo;i++){
        if(toDos[i].check === true){
            successToDo++;
        }
    }
    const per = Math.round((successToDo/toDo)*100);
    if(toDo !== 0){
        To.innerText=`할일 목록${toDo-successToDo}개`;
        Do.innerText=`한일 목록${successToDo}개`;
        perc.innerText = `한일 퍼센트${per}%`;
    }else{
        To.innerText =`할일 목록0개`
        Do.innerText =`한일 목록0개`
        perc.innerText =`한일 퍼센트0%`
        
    }
}

function clock(){
    const date = new Date;
    const year = date.getFullYear();
    const mon = date.getMonth()+1;
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    return `${year}.${mon}.${day}.${hour}.${min}`
}

function displayBlock(event){
    const li = event.target;
    const check = li.querySelector("input");
    const delBtn = li.querySelector("button");
    check.classList.add("block");
    delBtn.classList.add("block");
}

function displayNone(event){
    const li = event.target;
    const check = li.querySelector("input");
    const delBtn = li.querySelector("button");
    check.classList.remove("block");
    delBtn.classList.remove("block");
}

function paintToDo(text,check,timeLine){
    const li = document.createElement("li");
    const span = document.createElement("span");
    const spanTime = document.createElement("span");
    const successBox = document.createElement("input");
    const delButton = document.createElement("button");
    const id = toDos.length;
    successBox.type = "checkbox";
    successBox.checked = check;
    li.classList.add(check);
    span.classList.add("text");
    spanTime.classList.add("time");
    li.id = id;
    successBox.checked   
    successBox.addEventListener("click",success);
    successBox.addEventListener("click",percent);
    delButton.addEventListener("click",del);
    delButton.addEventListener("click",percent);
    li.addEventListener("mouseenter", displayBlock);
    li.addEventListener("mouseleave", displayNone);
    span.innerText=text;
    delButton.innerText="✖";
    successBox.innerText="⚪";
    spanTime.innerText = timeLine;
    li.appendChild(spanTime);
    li.appendChild(span);
    li.appendChild(successBox);
    li.appendChild(delButton);
    list.appendChild(li);
    const toDoData = {
        text,
        id,
        check:check,
        timeLine:timeLine
    }
    toDos.push(toDoData);
    saveTodo();
    percent();
}

function submit(event){
    event.preventDefault()
    const text = input.value;
    const legend = text.length
    if(legend<=11&&legend!==0){
        const time = clock();
        paintToDo(text,false,time);
        loadDraw(text)
        form.classList.add("hidden");
        formHidden = true
        input.value = "";
    }else{
        input.value = "";
    }
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const maxX = canvas.width;
const maxY = canvas.height;

let x=10,y=10;
ctx.font = '50px Black Han Sans';
ctx.font

let drawId = 0;
let hold = false

let downRead = false;
let draw = false;
let outDelRead = false;

let selectId;

let boxColor = "#F0CD5F";
let textColor = "black";
let checkColor = "#ffe3e3";

const drawing = [];
let drawingId = 0;

let startX;
let startY;

let curX;
let curY;

let i = 0;
function loadDraw(text){
    ctx.fillStyle = boxColor
    ctx.fillRect(x,y,500,75);
    ctx.fillStyle = textColor
    ctx.fillText(text,x,y+50)
    const drawToDoData = {
        x,
        y,
        text,
        drawId,
        boxColor,
        check: false
    }
    drawId++;
    if(x+1000<maxX){
        x=x+600;
    } else{
        x=10;
        y=y+100;
    }
    drawTodo.push(drawToDoData);
    saveDrawToDo();
}

function toDoDraw(){
    drawingDraw()
    for(let i=0;i<=drawId-1;i++){
        if(i!=selectId){
            ctx.fillStyle = drawTodo[i].boxColor
            ctx.fillRect(drawTodo[i].x,drawTodo[i].y,500,75);
            ctx.fillStyle = textColor
            ctx.fillText(drawTodo[i].text,drawTodo[i].x,drawTodo[i].y+50)
        }else{
        }
    }
}

function drawingSave(i){
    ctx.beginPath();
        ctx.moveTo(drawing[i].startX,drawing[i].startY);
        ctx.lineTo(drawing[i].curX,drawing[i].curY);
        ctx.stroke();
}

function toDoAllDraw(){
    for(let i=0;i<=drawId-1;i++){
            ctx.fillStyle = drawTodo[i].boxColor
            ctx.fillRect(drawTodo[i].x,drawTodo[i].y,500,75);
            ctx.fillStyle = textColor
            ctx.fillText(drawTodo[i].text,drawTodo[i].x,drawTodo[i].y+50)
    }
}


function pDraw(){
    ctx.clearRect(0, 0, maxX, maxY);
    drawingDraw();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(curX, curY);
    ctx.stroke();
    toDoAllDraw();
}

function loadDrawing(){
    ctx.beginPath();
    ctx.moveTo(drawing[i].startX,drawing[i].startY);
    ctx.lineTo(drawing[i].curX,drawing[i].curY);
    ctx.stroke();
}

function drawingDraw(){
    for(let i=0;i<=drawingId-1;i++){
        ctx.beginPath();
        ctx.moveTo(drawing[i].startX,drawing[i].startY);
        ctx.lineTo(drawing[i].curX,drawing[i].curY);
        ctx.stroke();
}
}


function down(e){
    const mouseX = e.offsetX
    const mouseY = e.offsetY
    for(let i=0;i<=drawId-1;i++){
        if(mouseX<drawTodo[i].x+500&&mouseX>drawTodo[i].x){
            if(mouseY<drawTodo[i].y+75&&mouseY>drawTodo[i].y){
                downRead = true;
                selectId = i;
                delId = drawTodo[i].drawId;
                canvas.style.cursor = "pointer"
            }
        }
    }
    if(!downRead)
    draw = true;
    startX = mouseX;
    startY = mouseY;
    
}

function move(e){
    if(downRead){
        ctx.clearRect(0, 0, maxX, maxY);
        const mouseX = e.offsetX
        const mouseY = e.offsetY
        drawTodo[selectId].x = mouseX
        drawTodo[selectId].y = mouseY
        const selectText = drawTodo[selectId].text
        toDoDraw()
        ctx.fillStyle = drawTodo[selectId].boxColor
        ctx.fillRect(mouseX,mouseY,500,75);
        ctx.fillStyle = textColor
        ctx.fillText(selectText,mouseX,mouseY+50)
        saveDrawToDo();
    }
    if(draw&&!downRead){
        curX = e.offsetX; 
        curY = e.offsetY;
        pDraw();
    }
    outDelRead = false;
}

function up(){
    downRead = false;
    canvas.style.cursor = "default"
    if(draw){
        const drawingData = {
            startX,
            startY,
            curX,
            curY
        }
        drawing.push(drawingData);
        drawingId++;
        saveDrawing();
    }
    if(outDelRead){
        delDrawToDo(delId)
        delToDo(delId)
        outDelRead = false;
    }
    draw = false;
}

function outDel(){
    console.log(delId);
    outDelRead = true;
}

function out(e){
    if(downRead){
        outDel();
    }
}

function drawingCheck(e){
    const mouseX = e.offsetX
    const mouseY = e.offsetY
    for(let i=0;i<=drawId-1;i++){
        if(mouseX<drawTodo[i].x+500&&mouseX>drawTodo[i].x){
            if(mouseY<drawTodo[i].y+75&&mouseY>drawTodo[i].y){
                if(!drawTodo[i].check){
                    drawTodo[i].boxColor = checkColor;
                    console.log("체크");
                    drawTodo[i].check = true;
                    toDoAllDraw()
                    saveDrawToDo();
                }else{
                    drawTodo[i].boxColor = boxColor;
                    console.log("해제");
                    drawTodo[i].check = false;
                    toDoAllDraw()
                    saveDrawToDo();
                }
            }
        }
    }
}

function CZDrawingDraw(){
    ctx.clearRect(0,0,maxX,maxY);
    for(let i=0;i<=drawingId-1;i++){
        ctx.beginPath();
        ctx.moveTo(drawing[i].startX,drawing[i].startY);
        ctx.lineTo(drawing[i].curX,drawing[i].curY);
        ctx.stroke();
}
}

function drawingBack(e){
    const key = e.key;
    console.log(key);
    if(key === "z"){
        if(drawingId>0){
            console.log("hey")
            drawing.pop();
            drawingId--;
            CZDrawingDraw();
            toDoAllDraw()
            saveDrawing();
        }
    }
}

//function drawingFront(){//
//    drawingId++;
//    CZDrawingDraw();
//    toDoAllDraw()
//}

let formHidden = true;

function keyDown(e){
    const key = e.key;
    if(key === "Control"){
        form.classList.toggle("hidden")
    }
}




function init(){
    loadToDo();
    form.addEventListener("submit",submit);
    canvas.addEventListener("mousedown",down);
    canvas.addEventListener("mousemove",move);
    window.addEventListener("mouseup",up);
    canvas.addEventListener("mouseout",out)
    canvas.addEventListener("dblclick",drawingCheck);
    window.addEventListener("keydown",keyDown)
    window.addEventListener("keydown",drawingBack)
}

init();