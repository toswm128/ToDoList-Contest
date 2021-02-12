const form = document.querySelector(".js-form"),
    input = form.querySelector("input"),
    list = document.querySelector("ul"),
    To = document.querySelector(".to"),
    Do = document.querySelector(".do"),
    perc = document.querySelector(".perc");


let toDos = [];
const TODO_LS = "toDos";

function saveTodo(){
    localStorage.setItem(TODO_LS,JSON.stringify(toDos));
}


function eachPaint(toDo){
    paintToDo(toDo.text,toDo.check,toDo.timeLine);
}

function loadToDo(){
    const loadToDos = localStorage.getItem(TODO_LS);
    if(loadToDos !== null){
        const paintToDos = JSON.parse(loadToDos);
        paintToDos.forEach(eachPaint);
    }
    percent();
}

function del(event){
    const btn = event.target;
    const li = btn.parentNode;
    list.removeChild(li);
    const removeText = toDos.filter(function(delToDo){
        console.log(parseInt(li.id));
        return delToDo.id !== parseInt(li.id);
    })
    toDos = removeText;
    saveTodo();
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
    loadDraw(text)
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
    const time = clock();
    paintToDo(text,false,time);
    input.value = "";
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const maxX = canvas.width;
const maxY = canvas.height;

let x=10,y=10;
ctx.font = '50px 궁서';

const drawTodo = [];
let drawId = 0;

let downRead = false;

let selectId;

function loadDraw(text){
    ctx.strokeRect(x,y,1000,1000);
    ctx.fillText(text,x,y+50)
    const drawToDoData = {
        x,
        y,
        text
    }
    if(x+1000<maxX){
        x=x+1100;
    } else{
        x=10;
        y=y+1100;
    }
    drawTodo.push(drawToDoData);
    drawId++;

}

function toDoDraw(){
    for(let i=0;i<=drawId-1;i++){
        if(i!=selectId){
            ctx.strokeRect(drawTodo[i].x,drawTodo[i].y,1000,1000);
            ctx.fillText(drawTodo[i].text,drawTodo[i].x,drawTodo[i].y+50)
        }
    }
}


function down(e){
    const mouseX = e.offsetX
    const mouseY = e.offsetY
    for(let i=0;i<=drawId-1;i++){
        console.log(mouseX,mouseY,drawTodo[i].x,drawTodo[i].y);
        if(mouseX<drawTodo[i].x+1000&&mouseX>drawTodo[i].x){
            if(mouseY<drawTodo[i].y+1000&&mouseY>drawTodo[i].y){
                console.log("hi");
                downRead = true;
                selectId = i;
            }
        }
    }
}

function move(e){
    if(downRead){
        ctx.clearRect(0, 0, maxX, maxY);
        const mouseX = e.offsetX
        const mouseY = e.offsetY
        drawTodo[selectId].x = mouseX
        drawTodo[selectId].y = mouseY
        const selectText = drawTodo[selectId].text
        ctx.strokeRect(mouseX,mouseY,1000,1000);
        ctx.fillText(selectText,mouseX,mouseY+50)
        toDoDraw()
    }
}

function up(){
    downRead = false;
}

function init(){
    loadToDo();
    form.addEventListener("submit",submit);
    canvas.addEventListener("mousedown",down);
    canvas.addEventListener("mousemove",move);
    canvas.addEventListener("mouseup",up);
}

init();