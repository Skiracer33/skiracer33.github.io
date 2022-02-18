import {csv} from "https://cdn.skypack.dev/d3-fetch@3";

let data= await csv("as_latin_vocab.csv");

console.log(data)

function gen_question(items){

  var item = items[Math.floor(Math.random()*items.length)];
  var lv=Math.floor(Math.random()*items.length)
  var ra1=lv
  var ra2=lv
  var ra3=lv
  var order=Math.floor(Math.random()*4) + 1
  var c=1
  while(ra1==lv){
    ra1=Math.floor(Math.random()*items.length)
  }
  while((ra2==lv || ra2==ra1) && c<10){
    ra2=Math.floor(Math.random()*items.length)
    c=c+1
  }
  while((ra2==lv || ra2==ra1) && c<10 ){
    ra2=Math.floor(Math.random()*items.length)
    c=c+1
  }
  while((ra3==lv || ra3==ra2 || ra3==ra1 )&& c<10){
    ra3=Math.floor(Math.random()*items.length)
    c=c+1
  }

  return [data[lv]['latin'],data[lv]['english'],
  data[ra1]['english'],data[ra2]['english'], data[ra3]['english'],order]
}



const main = document.createElement("main");
document.body.appendChild(main);

var score
var q
var ca
var lv
var ra1
var ra2
var ra3
var order

function start(){
  console.log('start')

  score=0
  q=gen_question(data)
  lv=q[0]
  ca=q[1]
  ra1=q[2]
  ra2=q[3]
  ra3=q[4]
  order=q[5]
  return `
  <h3 id="time">

  <h1 id="question"> </h1>

  <div style="text-align:center;">
    <input type="button" class="btn" id="button1" value="" />
    <input type="button" class="btn" id="button2" value="" />
    <input type="button" class="btn" id="button3" value="" />
    <input type="button" class="btn" id="button4" value="" />
  </div>
  <h2 id="answer">  </h2> 
  
  <h1 id="score"> Score: 0 </h1>

  <h2 id="prevans"> Previous Answer: </h2>
  
  <h4> Choose the correct english translation for the latin word. 
  For every correct answer you gain two points and every incorrect answer loses 1 point. 
  You have two minutes to get the highest score. The latin vocabulary is the list of required words for latin A level.
  Good Luck!
  </h4>
  `
}




function gen_answer(q){
  document.querySelector("#question").innerHTML=`Latin: ${q[0]}`
  ca=q[1]
  ra1=q[2]
  ra2=q[3]
  ra3=q[4]
  order=q[5]
  var new_order
  if (order==1){
    new_order = [ca, ra1, ra2, ra3]
  } else if (order==2){
    new_order = [ ra1,ca, ra2, ra3]
  } else if (order==3){
    new_order = [ra2, ra1, ca, ra3]
  } else{
    new_order = [ra3, ra1, ra2, ca]
  }
  b1.value=new_order[0]
  b2.value=new_order[1]
  b3.value=new_order[2]
  b4.value=new_order[3]
}

var b1
var b2
var b3 
var b4

function start2(){
  main.innerHTML = start();
  b1 = document.getElementById("button1");
  b2 = document.getElementById("button2");
  b3 = document.getElementById("button3");
  b4 = document.getElementById("button4");
  b1.addEventListener("click", function(){guess=1}, false);
  b2.addEventListener("click", function(){guess=2}, false);
  b3.addEventListener("click", function(){guess=3}, false);
  b4.addEventListener("click", function(){guess=4}, false);
  document.querySelector("#question").innerHTML=`Latin: ${lv}`
}

start2()
var guess = -1
var start_seconds = new Date().getTime() / 1000;
gen_answer(q)



window.addEventListener("keydown", function(event) {
  if(event.key=='1'){
    guess=1
  }else if(event.key=='2'){
    guess=2
  }else if(event.key=='3'){
    guess=3
  }else if(event.key=='4'){
    guess=4
  }
}, true);

function run_code(){

  let time = Math.floor(120 - new Date().getTime() / 1000 + start_seconds)
  if (time<0){
    main.innerHTML=`<h1> Congratulations your final score is: ${score}. </h1>
    <div style="text-align:center;">
    <input type="button" class="btn" id="button5" value="Retry?" />
    </div>` 
    const b5 = document.getElementById("button5");
    b5.addEventListener("click", function(){
      start2()
      start_seconds = new Date().getTime() / 1000;
      q=gen_question(data)
      gen_answer(q)
       }, false);
  } else{
    document.querySelector("#time").innerHTML= `Time: ${time}`
    if (guess!=-1){
      if(guess==order){
        score+=2
        console.log("correct")
      } else{
        score-=1
        console.log("incorrect")
      }
      guess=-1
      let prevans=q[1]
      q=gen_question(data)
      gen_answer(q)
      document.querySelector("#prevans").innerHTML=`Previous Answer: ${prevans}`
      document.querySelector("#score").innerHTML=`Score: ${score}`
    }
  }
}
setInterval(run_code,300)