

const main = document.createElement("main");
document.body.appendChild(main);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

var score=0
var time=120

let a1=getRandomInt(10,100)
let a2=getRandomInt(10,100)
let a3=getRandomInt(10,100)
let a4=getRandomInt(10,100)

var start_seconds = new Date().getTime() / 1000;

function choice(){
  main.innerHTML=`<h1> Pick a game: <h2>
  <input type="button" class="btn" id="button1" value="Add Game" />
  <input type="button" class="btn" id="button2" value="Subtraction Game" />
  <input type="button" class="btn" id="button3" value="Multiplication Game" />
  `
  b1 = document.getElementById("button1");
  b2 = document.getElementById("button2");
  b3 = document.getElementById("button3");
  b1.addEventListener("click", function(){
    game_choice=1 
    start()
    add_q()
  }, false);
  b2.addEventListener("click", function(){
    game_choice=2
    start()
    subtract_q()}, false);
  b3.addEventListener("click", function(){
    game_choice=3
    start()
    multi_q()
  }, false);
}



function start(){

  main.innerHTML= `<h1 id="time"> Time: ${Math.floor(120 - new Date().getTime() / 1000 + start_seconds)}</h1>
  <h1 id="question"> ${a1} + ${a2} + ${a3} + ${a4} =   </h1>

  <input type="text" id="name" name="name" required
  minlength="4" maxlength="8" size="10">

  <h2 id="score"> Score: ${score} </h2>

  <h3> Rules: Solve the question and type the answer in the box. Try to get as high score as possible in 2 minutes! </h3>
  `


}

function multi_q(){
  score+=1
  a1=getRandomInt(10,100)
  a2=getRandomInt(2,9)
  a3=getRandomInt(2,9)
  ans=a1*a2*a3
  document.querySelector("#name").value=""
  console.log('alter')
  document.querySelector("#question").innerHTML=`${a1} * ${a2} * ${a3} =   `
  console.log(document.querySelector("#question").innerHTML)
  document.querySelector("#score").innerHTML=`Score: ${score}`
}

function subtract_q(){
  console.log('correct')
  score+=1
  a1=getRandomInt(3000,9000)
  a2=getRandomInt(100,1000)
  a3=getRandomInt(100,1000)
  ans=a1-a2-a3
  document.querySelector("#name").value=""
  document.querySelector("#question").innerHTML=`${a1} - ${a2} - ${a3} =   `
  document.querySelector("#score").innerHTML=`Score: ${score}`
}

function add_q(){
  score+=1
  a1=getRandomInt(10,100)
  a2=getRandomInt(10,100)
  a3=getRandomInt(10,100)
  a4=getRandomInt(10,100)
  ans=a1+a2+a3+a4
  document.querySelector("#name").value=""
  document.querySelector("#question").innerHTML=`${a1} + ${a2} + ${a3} + ${a4} =   `
  document.querySelector("#score").innerHTML=`Score: ${score}`
}

var game_choice = -1
choice()
score=-1


function run_code(){
  if (game_choice<0){
    return 
  }
  let time = Math.floor(121 - new Date().getTime() / 1000 + start_seconds)
  document.querySelector("#time").innerHTML= `Time: ${time}`
  let ret=document.querySelector("#name").value
  if (ret==ans){
    if (game_choice==1){
      add_q()
    } else if(game_choice==2){
      subtract_q()
    } else if(game_choice==3){
      multi_q()
    }
  }
  document.querySelector("#name").autofocus=true

  if (time < 1){
    if (score>10){
      main.innerHTML=`<h1> Congratulations your score was: ${score} </h1>`
    } else{
      main.innerHTML=`<h1> Your score was only ${score} try harder next time</h1>`
    }
  }
  
}



setInterval(run_code,100)