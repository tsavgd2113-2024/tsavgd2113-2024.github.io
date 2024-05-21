LevelManager.levels.level3 = function() {
  intangible = []
  player.move(930, 1500, antiPlayer);
  level3Audio.play();

  evilPlayer.push(new EvilPlayerEnemy(110, 150, "trojanHorseLeft000", 3100, 500));
  // level3Audio.play();


  images.push(new ImageComponent(3000, 2000, "level3Background", 500, 0)); //background


  //numbers (width, length, color, x-cord, y-cord)
  walls.push(new Component(3000, 1000, "#4a100c", 500, 1500)); //level 1 floor


  //----------------//------Platform----//----------------//--------------
  walls.push(new Component(200, 50, "#1c1817", 1800, 1050));//small dots left

  walls.push(new Component(200, 50, "#1c1817", 2300, 1050)); //small dots right


  walls.push(new Component(400, 40, "#1c1817", 1200, 1260));//platform left

  walls.push(new Component(400, 40, "#1c1817", 2600, 1260));//platform right
  //----------------//----------------//----------------//----------------


  //borders here

  walls.push(new Component(250, 2500, "#013220", 500, -1000)); // left border

  walls.push(new Component(250, 2500, "#013220", 3250, -1000)); // right border






  levelCompleteMsg.innerText = `Congratulations! You have proven yourself to be worthy of defeating my virus. I thought I would never see the day...\n\nWell, there's always next time ;)`;
  nextBtn.style.display = "none";
  
  addItem("binaryGun");
  addItem("sword");
  selectItem(1);
}