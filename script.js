////////////////////////////////////////////
/*ADDING OBJECTS TO THE CANVAS TO BE DRAWN*/
////////////////////////////////////////////

var canvas = document.getElementById("gameSpace");
var ctx = canvas.getContext("2d");
var invisible = "rgba(0,0,0,0)";

var level1Audio = new GameAudio("/assets/music/Level1.mp3");
level1Audio.loop = true;

var level2Part1Audio = new GameAudio("/assets/music/Level2p1.mp3");
level2Part1Audio.loop = true;

var level2Part2Audio = new GameAudio("/assets/music/Level2p2.mp3");
level2Part2Audio.loop = true;

var level3Audio = new GameAudio("/assets/music/Level3.mp3");
level3Audio.loop = true;


// Initial game setup
function setup() {
  console.log("In setup");
  player = new Player(110, 150, "pLeft000", (canvas.width / 2) - 55, (canvas.height / 2) - 75);
  antiPlayer = new Component(110, 150, invisible, (canvas.width / 2) - 55, (canvas.height / 2) - 75);

  pLeftAnim = new AnimationController(player, ["pLeft000", "pLeft001"], 0.12);
  pRightAnim = new AnimationController(player, ["pRight000", "pRight001"], 0.12);
  pLeftAnim_BinaryGun = new AnimationController(player,["BG_pLeft000", "BG_pLeft001"], 0.12);
  pRightAnim_BinaryGun = new AnimationController(player,["BG_pRight000", "BG_pRight001"], 0.12);

  requestAnimationFrame(frameRate); /* Recursive function, will call itself every frame.
                                       Similar to void Update() in Unity. */
}
