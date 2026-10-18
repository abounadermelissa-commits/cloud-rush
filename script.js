document.getElementById("startButton").addEventListener("click", function() {
    document.getElementById("cloudrush").style.display = "none";
    document.getElementById("select-character").style.display = "flex";
});

document.getElementById("select").addEventListener("animationend", function() {
    document.getElementById("select").style.display = "none";
    document.getElementById("selector").style.display = "flex";
});

const characters = document.getElementById("characters").children; 
let Index = 0;
let next = document.getElementById("next");
let previous = document.getElementById("previous");

function render() {
    characters[0].style.display = "none";
    characters[1].style.display = "none";
    characters[2].style.display = "none";
    characters[3].style.display = "none";
    characters[4].style.display = "none";
    characters[5].style.display = "none";
    characters[Index].style.display = "block";       
}

next.addEventListener("click", function() {
    Index++;
    if (Index >= characters.length) {
        Index = 0;
    }
    render();
});

previous.addEventListener("click", function() {
    Index--;
    if (Index < 0) {
        Index = characters.length - 1;
    }
    render();
});

render();

const player= document.getElementById("player").children; 
let chosen=null;

function displayChar() {
 document.getElementById("player1").style.display="none"
 document.getElementById("player2").style.display="none"
 document.getElementById("player3").style.display="none"
 document.getElementById("player4").style.display="none"
 document.getElementById("player5").style.display="none"
 document.getElementById("player6").style.display="none"
document.getElementById("player" +(chosen+1)).style.display="block"
}

document.getElementById("choose").addEventListener("click", function() {
    chosen=Index
    document.getElementById("selector").style.display="none";
    document.getElementById("game").style.display="flex";
    displayChar()
})
let y=0
let score=0
document.getElementById("start").addEventListener("click", function(){
    startScore();
    document.getElementById("player"+(chosen+1)).style.animation="animation1 4s forwards";
     document.addEventListener("keydown",function(event){
       if( event.key === "ArrowDown"){
        y+=80;}
        if (event.key === "ArrowUp"){
        y-=80;}
    document.getElementById("player"+(chosen+1)).style.transform="translateY("+ y + "px)";
    })

})



let scoreInterval = null;

const game = document.getElementById("game");
const scoreText = document.getElementById("score");
const gameOverBox = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const playAgainBtn = document.getElementById("play-again");

const obstaclePics = ["cloud-ob.png", "bird.png", "stone.png"];

let obstacles = [];
let obstacleSpawner = null;
let obstacleMover = null;
let speed = 5;

const SHRINK = 0.25;
const DEBUG = false;   

let spriteRatio = 1; 


function loadRatio() {
  const me = document.getElementById("player" + (chosen + 1));
  const url = getComputedStyle(me).backgroundImage
    .replace(/^url\(["']?/, "")
    .replace(/["']?\)$/, "");
  const pic = new Image();
  pic.onload = function () {
    spriteRatio = pic.naturalHeight / pic.naturalWidth;
  };
  pic.src = url;
}

function startScore() {
  score = 0;
  scoreText.textContent = "Score: " + score;
  gameOverBox.classList.add("hidden");

  loadRatio();

  scoreInterval = setInterval(function () {
    score = score + 1;
    scoreText.textContent = "Score: " + score;
  }, 1000);

  startObstacles();
}

function endGame() {
  clearInterval(scoreInterval);
  stopObstacles();
  finalScore.textContent = score;
  gameOverBox.classList.remove("hidden");
}

function spawnObstacle() {
  const img = document.createElement("img");
  img.src = obstaclePics[Math.floor(Math.random() * obstaclePics.length)];
  img.className = "obstacle";
  img.style.left = game.offsetWidth + "px";
  img.style.top = Math.random() * (game.offsetHeight - 170) + "px";
  game.appendChild(img);
  obstacles.push(img);
}


function picBox(el) {
  const r = el.getBoundingClientRect();


  if (el.id.startsWith("player")) {
    let percent = parseFloat(getComputedStyle(el).backgroundSize) / 100;
    if (isNaN(percent)) {
      percent = 1;
    }
    const w = r.width * percent;
    return { left: r.left, top: r.top, width: w, height: w * spriteRatio };
  }

  return { left: r.left, top: r.top, width: r.width, height: r.height };
}


function hitbox(el) {
  const b = picBox(el);
  const sx = b.width * SHRINK;
  const sy = b.height * SHRINK;
  return {
    left: b.left + sx,
    right: b.left + b.width - sx,
    top: b.top + sy,
    bottom: b.top + b.height - sy
  };
}

function touching(a, b) {
  const r1 = hitbox(a);
  const r2 = hitbox(b);
  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  );
}


function showBox(el) {
  if (!DEBUG) return;
  const box = hitbox(el);
  if (!el.dbg) {
    el.dbg = document.createElement("div");
    el.dbg.style.position = "fixed";
    el.dbg.style.border = "2px solid red";
    el.dbg.style.zIndex = "20";
    el.dbg.style.pointerEvents = "none";
    document.body.appendChild(el.dbg);
  }
  el.dbg.style.left = box.left + "px";
  el.dbg.style.top = box.top + "px";
  el.dbg.style.width = (box.right - box.left) + "px";
  el.dbg.style.height = (box.bottom - box.top) + "px";
}

function moveObstacles() {
  const me = document.getElementById("player" + (chosen + 1));
  showBox(me);

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const ob = obstacles[i];
    ob.style.left = ob.offsetLeft - speed + "px";
    showBox(ob);

    if (touching(me, ob)) {
      endGame();
      return;
    }

    if (ob.offsetLeft < -200) {
      if (ob.dbg) ob.dbg.remove();
      ob.remove();
      obstacles.splice(i, 1);
    }
  }
}

function startObstacles() {
  obstacles.forEach(function (ob) {
    if (ob.dbg) ob.dbg.remove();
    ob.remove();
  });
  obstacles = [];

  obstacleSpawner = setInterval(spawnObstacle, 3500);
  obstacleMover = setInterval(moveObstacles, 20);
}

function stopObstacles() {
  clearInterval(obstacleSpawner);
  clearInterval(obstacleMover);
}

playAgainBtn.addEventListener("click", startScore);