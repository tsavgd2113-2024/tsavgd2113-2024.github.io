/*LevelManager.levels.level2 = function() {
  intangible = []
  images = []
  player.move(1000, 1100, antiPlayer);
  level2Part1Audio.play();

  trojanHorse.push(new TrojanHorseEnemy(190, 190, "trojanHorseLeft000", 3100, 860));


  // level2Audio.play();
  swordCollectable.push(new ImageComponent(200, 75, "glitchSwordLeft", 2750, 780));

  images.push(new ImageComponent(3000, 2000, "level1Background", 500, -500)); //background




  walls.push(new Component(350, 30, "#196A0B", 3000, 830));
  //position of trojan and platform

  //numbers (width, length, color, x-cord, y-cord)
  walls.push(new Component(3000, 1000, "#39FF14", 500, 1500)); //level 1 floor

//--OBBY--
   walls.push(new Component(200, 30, "#21FFB6", 900, 1260)); //left platform
   walls.push(new Component(150, 30, "#21FFB6", 650, 1050));//Top platform
   walls.push(new Component(200, 30, "#21FFB6", 870, 860)); //Top platform
   walls.push(new Component(200, 30, "#21FFB6", 1450, 800)); //Top platform
   walls.push(new Component(300, 30, "#21FFB6", 2000, 670)); 
//--OBBY--

  walls.push(new Component(250, 30, "#21FFB6", 1500, 1260)); //Top platform
  walls.push(new Component(250, 30, "#21FFB6", 2150, 1260));
  walls.push(new Component(250, 30, "#21FFB6", 2800, 1260));
  
  walls.push(new Component(600, 30, "#21FFB6", 2700, 860)); // platform 








  //walls.push(new Component(100, 50, "#196A0B", 1050, 500));

  //borders here

  walls.push(new Component(50, 2500, "#013220", 500, -1000)); // left border

  walls.push(new Component(50, 2500, "#013220", 3450, -1000)); // right border








  levelCompleteMsg.innerText = `Great job defeating the Trojan Horse!\n\nIf you thought this level was hard, wait until the next level... Good luck! You'll need it...`;
  addItem("binaryGun");
  selectItem(0);
}*/

LevelManager.levels.level2 = function() {
  intangible = []
  images = []
  
  trojanHorse.push(new TrojanHorseEnemy(190, 190, "trojanHorseRight000", 300, -270));


  // level2Audio.play();
  swordCollectable.push(new ImageComponent(200, 75, "glitchSwordRight", 550, -290));
  intangible = []
  images = []
  player.move(600, 1500, antiPlayer);
  level2Part1Audio.play();
  walls.push(new Component(50, 2500, "rgba(0,0,0,0)", 100, -1000)); // left border

  walls.push(new Component(50, 2500, "rgba(0,0,0,0)", 3550, -1000)); // right border
  var bgcolor = "#131314"
  images.push(new Component(8000, 10000, bgcolor, -1000, -2000)); //background
  walls.push(new Component(8000, 1000, "#191a1c", -1000, 1500)); //level 1 floor
  
  walls.push(new PlatformComponent(300, 47, bgcolor, 950, 1260, "10111", 1));
  walls.push(new PlatformComponent(300, 47, bgcolor, 950, 1020, "101010", 2));
  walls.push(new PlatformComponent(300, 47, bgcolor, 950, 800, "1110110", 2.5));
  walls.push(new PlatformComponent(300, 47, bgcolor, 950, 600, "011010001", 1));
  walls.push(new PlatformComponent(300, 47, bgcolor, 950, 400, "011010", 4));
  walls.push(new PlatformComponent(300, 47, bgcolor, 950, 200, "10101011", 2));
  walls.push(new PlatformComponent(300, 47, bgcolor, 950, 0, "011010101", 4));
  walls.push(new PlatformComponent(300, 47, bgcolor, -50, -200, "01010100 01110101 01110010 01101110 00100000 01100010 01100001 01100011 01101011", 0));
  //trojanHorse.push(new TrojanHorseEnemy(190, 190, "trojanHorseLeft000", 3100, 860));
  
  levelCompleteMsg.innerText = `Great job defeating the Trojan Horse!\n\nIf you thought this level was hard, wait until the next level... Good luck! You'll need it...`;
  addItem("binaryGun");
  selectItem(0);
}