////////////////////
/*Library Commands*/
////////////////////

window.addEventListener("blur", function() {
  if (gameStarted && !paused && !debug) {
    togglePause();
  }
});

window.addEventListener("load", function() {
  document.getElementById("loadingDisplay").style.display = "none";
  document.getElementById("startBtn").style.display = "inline-block";
});

document.getElementById("startBtn").addEventListener("click", function() {
document.getElementById("startMenu").style.display = "none";
document.getElementById("preloadMenu").style.display = "block";

  var txt = `Hello!\n\nYou're probably wondering why you got here -- and why you're seeing this.\n\nMy name is Tron, I'm the hacker who developed the virus you just ran (sorry). Good news though! If you're seeing this, the virus is working! Bad news: you're now stuck inside this computer.\n\nThe only way to escape will be to defeat three different types of viruses from within the computer, starting with -- well, you'll see. Good luck!`;
  var i = 0;

  typeWriter();

  function typeWriter() {
    if (i < txt.length) {
      document.getElementById("typewriter").innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeWriter, 30);
    }
  }

  setTimeout(function() {
    document.getElementById("continueBtn").style.display = "inline-block";
  }, 13500);
});

document.getElementById("continueBtn").addEventListener("click", function() {
  document.getElementById("preloadMenu").style.display = "none";
  gameSpace.style.display = "inline-block";
  startGame();
});

document.getElementById("restartBtn").addEventListener("click", function() {
  document.getElementById("restartMenu").style.display = "none";
  switchLevel(LevelManager.currentLevel);
  resumeGameLoop();
});

document.getElementById("nextBtn").addEventListener("click", function() {
  document.getElementById("successMenu").style.display = "none";
  switchLevel(LevelManager.currentLevel + 1);
  resumeGameLoop();
});

// DEBUG LEVEL BUTTONS
document.getElementById("l1Btn").addEventListener("click", function(e) {
  switchLevel(1);
  e.target.blur();
});

document.getElementById("l2Btn").addEventListener("click", function(e) {
  switchLevel(2);
  e.target.blur();
});

document.getElementById("l3Btn").addEventListener("click", function(e) {
  switchLevel(3);
  e.target.blur();
});


window.addEventListener("keydown", function(e) {
  gameSpace.keys = (gameSpace.keys || []);
  gameSpace.keys[e.code] = true;
});

window.addEventListener("keyup", function(e) {
  gameSpace.keys[e.code] = false;
  if (e.code == "Escape" && gameStarted) {
    togglePause();
  }

  if (e.code == "KeyQ" && !gameStarted) {
    quickStart();
  }

  if (new RegExp("[1-9]", "g").test(e.key)) {
    const index = parseInt(e.key) - 1;
    if (index <= Object.keys(inventory).length - 1) {
      selectItem(index);
    }
  }

  if (e.code == "Enter") {
    for (var item of Object.keys(inventory)) {
      if (inventory[item].selected && inventory[item].behavior == "toggle") {
        inventory[item].active = !inventory[item].active;
      }
    }
  }
});

window.addEventListener("mousedown", () => {
  mouseDown = true;
})

window.addEventListener("mouseup", () => {
  mouseDown = false;
})

function quickStart() {
  document.getElementById("startMenu").style.display = "none";
  document.getElementById("preloadMenu").style.display = "none";
  gameSpace.style.display = "inline-block";
  startGame();
}

function startGame() {
  console.log("In startGame");
  gameStarted = true;
  setup();
  LevelManager.levels.level1();

  if (debug) {
    document.getElementById("devMenu").style.display = "block";
  }
}


function togglePause() {
  console.log("pause toggled");
  if (!paused) {
    stopGameLoop();
    GameAudio.pauseAll();
    showPauseMenu();
  } else {
    hidePauseMenu();
    GameAudio.resumeAll();
    resumeGameLoop();
  }
}

function stopGameLoop() {
  paused = true;
}

function resumeGameLoop() {
  paused = false;
  lastUpdate = undefined;
  requestAnimationFrame(frameRate);
}

function showPauseMenu() {
  document.getElementById("pause-menu").style.display = "block";
}

function hidePauseMenu() {
  document.getElementById("pause-menu").style.display = "none";
}

/** 
 * Checks collision between two objects
 * @param {BaseComponent} obj1 - Object 1 Component
 * @param {BaseComponent} obj2 - Object 2 Component
 * @returns {boolean} True if obj1 and obj2 are colliding, false otherwise
 */
function collisionCheck(obj1, obj2) {
  return (obj1.x + obj1.width >= obj2.x && obj1.x <= obj2.x + obj2.width && obj1.y <= obj2.y + obj2.height && obj1.y + obj1.height >= obj2.y);
}

/**
 * Finds the distance between two objects.
 * @param {BaseComponent} obj1 - Object 1 Component
 * @param {BaseComponent} obj2 - Object 2 Component
 * @returns {number} The distance between the center of obj1 and obj2
 */
function distance(obj1, obj2) {
  var obj1x = obj1.x + obj1.width / 2;
  var obj1y = obj1.y + obj1.height / 2;
  var obj2x = obj2.x + obj2.width / 2;
  var obj2y = obj2.y + obj2.height / 2;
  var distance = Math.sqrt(Math.pow((obj1x - obj2x), 2) + Math.pow((obj1y - obj2y), 2));
  return distance;
}

// old
function checkVision(x1, y1, x2, y2, x3, y3, x4, y4) {
  var a_dx = x2 - x1;
  var a_dy = y2 - y1;
  var b_dx = x4 - x3;
  var b_dy = y4 - y3;
  var s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
  var t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
  return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
}

/** 
 * Handles looping through an object's array to update and alter their positions.
 * @param {BaseComponent[]} obj - Array of objects to print
 */
function print(obj, alpha, ap) {
  for (var i = 0; i < obj.length; i++) {
    obj[i].render(alpha, ap);
  }
}

/** 
 * Prints the inventory to the screen.
 */
function inventoryGUI() {
  var spacing = 5;
  var boxWidth = 80;
  var boxHeight = 80;
  var boxX = (1920 / 2 - ((Object.keys(inventory).length * boxWidth) / 2) - boxWidth) - spacing;
  var boxY = canvas.height - 100;
  var totalWidth = 0;

  // center marker
  // GUIRenderer.drawRect(5, 80, "red", (canvas.width/2)-(5/2), 1000)

  Object.keys(inventory).forEach((item, i) => {

    boxX += boxWidth + spacing;

    GUIRenderer.drawRect(boxWidth, boxHeight, "rgba(0,0,0,0.5)", boxX, boxY);
    GUIRenderer.drawImage(boxWidth - 20, boxHeight - 20, inventory[item].imageID, boxX + 10, boxY + 10);
    GUIRenderer.drawText(i + 1, "rgb(255,255,255)", "20px Arial", boxX + 60, boxY + 25);
    GUIRenderer.drawText("x" + inventory[item].quantity, "rgb(255,255,255)", "20px Arial", boxX + 55, boxY + 70);

    if (inventory[item].selected) {
      GUIRenderer.strokeRect(boxWidth, boxHeight, "orange", boxX, boxY, 7);
    } else {
      GUIRenderer.strokeRect(boxWidth, boxHeight, "white", boxX, boxY, 5);
    }
  });
}

/** 
 * Add an item to the inventory using its name/identifier.
 * @param {string} id - the identifier of the item to add
 */
function addItem(id) {
  if (!inventory[id]) {
    inventory[id] = { ...gameItems[id], selected: false, quantity: 1, active: false, timer: 0 };
  }
  if (debug) {
    console.table(inventory);
  }
}

/** 
 * Remove an item from the inventory using its name/identifier.
 * @param {string} id - the identifier of the item to remove
 */
function removeItem(id) {
  if (inventory[id]) {
    delete inventory[id];
  }
}

/** 
 * Select an item from the inventory using its index.
 * @param {number} index - the index of the item to delete
 */
function selectItem(index) {
  Object.keys(inventory).forEach((item, i) => {
    if (index == i) {
      inventory[item].selected = true;
    } else {
      inventory[item].selected = false;
    }
  })
}

/**
 * Generates a random number.
 * @param {number} min - the minimum number that can be generated (inclusive)
 * @param {number} max - the maximum number that can be generated (exclusive)
 */
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// LEVELING SYSTEM 
// show the gameover screens --- only applies to our game


/** 
 * Switches level to a specified level.
 * @param {number} level - Level to switch to
 */
function switchLevel(level) {
  if (!LevelManager.levels["level" + level]) {
    return alert("Invalid level:", level);
  }

  player.speedX = 0;
  player.speedY = 0;
  antiPlayer.speedX = 0;
  antiPlayer.speedY = 0;

  GameAudio.stopAll();

  ///// RESET /////

  // player
  player.HP = startingPlayerHP;

  //enemies
  worms = [];
  trojanHorse = [];
  evilPlayer = [];
  lasers = [];

  //timers
  level1Timer = 60;

  //walls and assets
  walls = [];
  images = [];

  //weapons
  swordCollectable = [];
  sword = null;
  bullets = [];
  inventory = {};



  LevelManager.currentLevel = level;

  //LevelManager.getLevel(level); //for tilemap testing
  LevelManager.levels["level" + level]();
}

/**
 * Shows the level failed screen
 *
 * @param {string} message - The message to show on the failed screen.
 */
function failLevel(message = "Good luck next time...") {
  document.getElementById("restartMenu").style.display = "block";
  levelFailMsg.innerText = message;
  paused = true;
}

function completeLevel() {
  document.getElementById("successMenu").style.display = "block";
  paused = true;
}

var swordHbActive;

function swordCollectableUpdate() {
  showCollectableDialog = false;
  
  for (let i = 0; i < swordCollectable.length; i++) {
    if (distance(swordCollectable[i], player) < 100) {
      showCollectableDialog = true;

      if (gameSpace.keys && gameSpace.keys["KeyF"]) {
        swordCollectable.splice(i, 1);
        addItem("sword");
        trojanHorse[0].active = true;
        GameAudio.stopAll();
        level2Part2Audio.play();
        break;
      }
    }
    
    swordCollectable[i].update();
  }
}

// WEAPONS
function swingSword() {
  if (inventory["sword"] && inventory["sword"].timer > 0) {
    inventory["sword"].timer -= dt;
  }

  if (((gameSpace.keys && gameSpace.keys["Enter"]) || mouseDown) && inventory["sword"] && inventory["sword"].selected && !inventory["sword"].active && inventory["sword"].timer <= 0) {
    inventory["sword"].timer = inventory["sword"].cooldownTime;
    inventory["sword"].active = true;
    swordHbActive = true;
  }

  if (inventory["sword"] && inventory["sword"].active) {
    if (!sword) {
      var swordImage = "";
      if (player.lastDirection == "left") {
        angleSpeed = -20 * Math.PI / 360;
        swordImage = "glitchSwordRight";
      } else {
        angleSpeed = 20 * Math.PI / 360;
        swordImage = "glitchSwordLeft";
      }

      sword = new ImageComponent(100, 30, swordImage, player.x, player.y);
    }


    sword.translationX = player.x + player.width / 2
    sword.translationY = player.y + player.height / 2
    sword.x = player.x
    sword.y = player.y


    sword.angle += angleSpeed;
    if (sword.angle < -Math.PI || sword.angle > Math.PI) {
      inventory["sword"].active = false;
      sword = null;
      console.log("ENDED")
    }
  }
}

var bulletTimer = 0;
var bulletTimerTime = 0.5; //0.5 seconds between shots

function fireGun() {
  var bulletSpeed = 1250;
  var bulletSize = 30;
  if (inventory["binaryGun"] && inventory["binaryGun"].selected && ((gameSpace.keys && gameSpace.keys["Enter"]) || mouseDown) && bulletTimer <= 0) {
    const rand = Math.random();
    const bulletImg = rand < 0.5 ? "zero" : "one";
    var px, py;
    if (player.lastDirection=="left") {
      px = player.x
      py = player.y
    } else {
      px = player.x + player.width
      py = player.y
    }
    bullet = new ImageComponent(bulletSize, bulletSize, bulletImg, px, py + (player.height / 2) + 20)
    if (player.lastDirection == "left") {
      bullet.speedX = -bulletSpeed * dt
    } else {
      bullet.speedX = bulletSpeed * dt
      console.log("Pew")
    }

    bullets.push(bullet);
    bulletTimer = bulletTimerTime;
  }

  if (bulletTimer > 0) {
    bulletTimer -= dt;
  }
}


function flashlight() { //Start Flashlight
  let size = 50; //for Flashlight *Dont Delete*
  //x = 990 y = 560 for centered
  //arc(x, y, radius, startAngle, endAngle, counterclockwise)
  //inventory["flashlight"].active = (true / false) toggles flashlight
  if (inventory["flashlight"] && inventory["flashlight"].active) {
    size = 500;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width, 0, Math.PI * 2, true);
    ctx.arc(canvas.width / 2, canvas.height / 2, 600, 0, Math.PI * 2, false);
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 700, 0, Math.PI * 2, true);
    // ctx.arc(canvas.width / 2, canvas.height / 2, 0, 0, Math.PI * 2, false);
    var grd = ctx.createRadialGradient((canvas.width / 2), (canvas.height / 2), 600, (canvas.width / 2), (canvas.height / 2), 300);
    grd.addColorStop(0, "rgba(0,0,0,1)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.fill();
  }
  else if (inventory["flashlight"] && !debug) {
    GUIRenderer.drawRect(canvas.width, canvas.height, "rgba(0,0,0,1)", 0, 0);
  }
}


/** ENEMY LOGIC **/
function wormUpdate(dt, walls, ap) {
  wormsLoop: for (var i = 0; i < worms.length; i++) {
    for (var j = 0; j < bullets.length; j++) {
      if (collisionCheck(worms[i], bullets[j])) {
        bullets.splice(j, 1);
        if (worms[i].remainingHits > 0) {
          worms[i].remainingHits--;
        } 

        if (worms[i].remainingHits <= 0) {
          if (worms[i].generation < 2) {
            worms.push(new WormEnemy(worms[i].width - 20, worms[i].height - 20, "worm000", worms[i].x, worms[i].y, 0, 1, worms[i].generation + 1));
            worms.push(new WormEnemy(worms[i].width - 20, worms[i].height - 20, "worm000", worms[i].x, worms[i].y, 0, -1, worms[i].generation + 1));
          }
          worms.splice(i, 1);
        }
        break wormsLoop;
      }
    }

    worms[i].update(dt, walls, ap);
  }
}

function trojanHorseUpdate(dt, walls, ap) {
  horseLoop: for (var i = 0; i < trojanHorse.length; i++) {
    for (var j = 0; j < bullets.length; j++) {
      if (trojanHorse[i].active && collisionCheck(trojanHorse[i], bullets[j])) {
        bullets.splice(j, 1);

        if (trojanHorse[i].remainingHits > 0) {
          trojanHorse[i].remainingHits--;
        }

        if (trojanHorse[i].remainingHits <= 0) {
          trojanHorse.splice(i, 1);
        }

        break horseLoop;
      }
    }

    if (trojanHorse[i].active && sword && swordHbActive && collisionCheck(trojanHorse[i], sword)) {
      swordHbActive = false;
      trojanHorse[i].knockBackInfo.enabled = true;
      trojanHorse[i].knockBackInfo.startTime = Math.floor(performance.now() / 1000)
      trojanHorse[i].knockBackInfo.direction = player.lastDirection
      console.log("KNOCKBACK STARTED!")

      if (trojanHorse[i].remainingHits > 0) {
        trojanHorse[i].remainingHits -= 2;
      }

      if (trojanHorse[i].remainingHits <= 0) {
        trojanHorse.splice(i, 1);
      }
  
      break horseLoop;
    }

    trojanHorse[i].update(dt, walls, ap);
  }
}

function evilPlayerUpdate(dt, walls, ap) {
  evilPlayerLoop: for (var i = 0; i < evilPlayer.length; i++) {
    for (var j = 0; j < bullets.length; j++) {
      if (collisionCheck(evilPlayer[i], bullets[j])) {
        bullets.splice(j, 1);
        
        if (evilPlayer[i].remainingHits > 0) {
          evilPlayer[i].remainingHits -= 2;
        }
        
        if (evilPlayer[i].remainingHits <= 0) {
          evilPlayer.splice(i, 1);
        }

        break evilPlayerLoop;
      }
    }

    if (sword && swordHbActive && collisionCheck(evilPlayer[i], sword)) {
      swordHbActive = false;
      evilPlayer[i].knockBackInfo.enabled = true;
      evilPlayer[i].knockBackInfo.startTime = Math.floor(performance.now() / 1000)
      evilPlayer[i].knockBackInfo.direction = player.lastDirection
      console.log("KNOCKBACK STARTED!");
      
      if (evilPlayer[i].remainingHits > 0) {
        evilPlayer[i].remainingHits -= 5;
      }
      
      if (evilPlayer[i].remainingHits <= 0) {
        evilPlayer.splice(i, 1);
      }

      break evilPlayerLoop;
    }

    evilPlayer[i].update(dt, walls, ap);
  }
}