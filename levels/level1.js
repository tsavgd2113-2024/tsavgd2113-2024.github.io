

const level = [
  "g                                                              g ",
  "d                                                              d ",
  "d   P            W   W                                         d ",
  "dgggggg         gggggggggggg                                   d  ",
  "d                                                              d  ",
  "d                                                              d ",
  "d                                                              d ",
  "d                                                              d ",
  "d rrrrrr p rrrrrrrrrrrrr rrr rr     rrr    p rr  rrrrrrrr  rrrrd ",
  "dggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
]

const unit = 70;

var Props = {
  'P' : (x,y) => {
    player.move(unit*x, unit*y, antiPlayer);
  },
  'W' : (x,y) => {
    worms.push(new WormEnemy(275, 75, "worm000", unit*x, unit*y, 0, -1));
  },
  'r' : (x,y) => {
    var type = Math.random()
    if (type<0.6) {
      type = 1
    } else if (type < 0.85) {
      type = 2
    } else {
      type = 3
    }
    console.log(`LiteralGrass_${type}`)
    intangible.push(new ImageComponent(unit+1, unit+1, `LiteralGrass_${type}`, unit*x, unit*y))
  },
  'p' : (x,y) => {
    intangible.push(new ImageComponent(unit+1, unit+10, "LeafyPlant", unit*x, unit*y))
  },
  ["Tiles"] : {
    'g' : "grass",
    'd' : "dirt",
  }
};

function handleProp(prop, x, y) {
  var img = Props["Tiles"][prop]
  if (img) {
    walls.push(new ImageComponent(unit+1, unit+1, img, unit*x, unit*y))
    
    return;
  }
  var handler = Props[prop];
  if (handler) {
    handler(x, y)
  }
}

LevelManager.levels.level1 = function() {
  intangible = []
  for (var y=0;y<level.length;y++) {
    for (var x=0;x<level[0].length;x++) {
      var prop = level[y][x];
      if (prop!=' ') {
        handleProp(prop, x, y);
      }
    }
  }
  worms.push(new WormEnemy(275, 75, "worm000", 1030, 500));
  worms.push(new WormEnemy(275, 75, "worm000", 3100, 500, 0, -1));


  // Other setup
  levelCompleteMsg.innerText = `Great job on completing your first task! Don't get too confident though...\n\nThe task for this next level is simple: collect the sword.`;

  addItem("binaryGun");
  selectItem(0);
  level1Audio.play();
  images.push(new ImageComponent(8000, 4000, "level1Background",-1500, -2000)); //background
}