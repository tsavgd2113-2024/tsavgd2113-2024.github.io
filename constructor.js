///////////////////////
/*CONSTRUCTOR CLASSES*/
///////////////////////

/** Represents an audio object. Works similarly to window.Audio. */
class GameAudio extends window.Audio {
  static instances = [];
  static pausedTracks = [];

  /**
   * Create an audio object and add it to instances
   * @param {string} src - Link to audio source
   */
  constructor(src) {
    const audio = super(src);
    this.controls = false;
    this.constructor.instances.push(audio);
  }

  /** Pauses all audio objects */
  static pauseAll() {
    this.instances.forEach(instance => {
      if (instance.paused == false) {
        instance.pause();
        this.pausedTracks.push(instance);
      }
    })
  }

  /** Resumes all audio objects */
  static resumeAll() {
    this.pausedTracks.forEach((instance, i) => {
      instance.play();
      this.pausedTracks.splice(i, 1);
    })
  }

  /** Stops all audio objects */
  static stopAll() {
    this.instances.forEach((instance, i) => {
      instance.pause();
      instance.currentTime = 0;
      this.instances.slice(i, 1);
    })
  }
}

// The difference between this class and BaseComponent is that this will always render objects to stay in the same spot in the canvas. Methods in this class should be used only for GUI components, while component methods should be use for making interactable objects in the game.

/** Draws UI elements to the screen */
class GUIRenderer {
  /** 
   * Draws text to a point on the screen
   * @param {string} text - The text to write
   * @param {string} color - The text color
   * @param {string} font - The font and size
   * @param {number} x - X-coordinate on screen
   * @param {number} y - Y-coordinate on screen
   */
  static drawText(text, color, font, x, y) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y);
  }

  /** 
   * Draws a rectangle to a point on the screen
   * @param {number} width - The width of the rect
   * @param {number} height - The height of the rect
   * @param {string} color - The color of the rect
   * @param {number} x - X-coordinate on screen
   * @param {number} y - Y-coordinate on screen
   */
  static drawRect(width, height, color, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  /** 
   * Strokes (outlines) a rectangle to a point on the screen
   * @param {number} width - The width of the rect
   * @param {number} height - The height of the rect
   * @param {string} color - The color of the rect
   * @param {number} x - X-coordinate on screen
   * @param {number} y - Y-coordinate on screen
   * @param {number} lineWidth - Line width
   */
  static strokeRect(width, height, color, x, y, lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, width, height);
  }

  /** 
   * Draws an image to a point on the screen
   * @param {number} width - The width of the image
   * @param {number} height - The height of the image
   * @param {string} imageId - The ID of the image in the DOM
   * @param {number} x - X-coordinate on screen
   * @param {number} y - Y-coordinate on screen
   */
  static drawImage(width, height, imageId, x, y) {
    const image = document.getElementById(imageId);
    ctx.drawImage(image, x, y, width, height);
  }

  /** 
   * Draws a circle to a point on the screen
   * @param {number} diameter - The diameter of the circle
   * @param {string} color - The color of the circle
   * @param {number} x - X-coordinate on screen
   * @param {number} y - Y-coordinate on screen
   */
  static drawCircle(diameter, color, x, y) {
    ctx.beginPath();
    ctx.arc(x + (diameter / 2), y + (diameter / 2), diameter / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

/** Represents an interactable object within the game. */
class BaseComponent {
  /**
   * @param {number} width - The width of the object
   * @param {number} height - The height of the object
   * @param {number} x - X-coordinate
   * @param {number} y - Y-coordinate
   * @param {number} angle - Rotation angle in degrees
   */
  constructor(width, height, x, y, angle = 0) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.originalWidth = width;
    this.originalHeight = height;
    this.originalX = x;
    this.originalY = y;

    this.speedX = 0;
    this.speedY = 0;

    this.lastX = this.x;
    this.lastY = this.y;
    this.translationY;
    this.translationX;

    this.angle = angle;
  }

  /** Updates object transforms for camera's perspective. */
  render(alpha, ap) {
    var x = ap.lastX + (ap.x - ap.lastX) * alpha;
    var y = ap.lastY + (ap.y - ap.lastY) * alpha;
    ctx.translate(x - (canvas.width / 2), y - (canvas.height / 2));
    ctx.translate(this.translationX || this.x + (this.width / 2), this.translationY || this.y + (this.height / 2));
    //console.log(this.x, this.y)
    // this translate is so that the angle rotates around the object's center even though it looks irrelevant
    ctx.rotate(this.angle);
    ctx.translate(-(this.translationX || this.x + (this.width / 2)), -(this.translationY || this.y + (this.height / 2))); //revert so we don't mess up positions
  }

  /** Updates speedX and speedY. */
  update() {
    this.lastX = this.x;
    this.lastY = this.y;
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

/**
 * A regular rectangular object.
 * @extends BaseComponent
 */
class Component extends BaseComponent {
  /**
   * @param {number} width - The width of the object
   * @param {number} height - The height of the object
   * @param {string} color - The color of the object
   * @param {number} x - X-coordinate
   * @param {number} y - Y-coordinate
   * @param {number} angle - Rotation angle in radians
   */
  constructor(width, height, color, x, y, angle) {
    super(width, height, x, y, angle);
    this.color = color;
  }

  render(alpha, ap) {
    var x = this.lastX + (this.x - this.lastX) * alpha;
    var y = this.lastY + (this.y - this.lastY) * alpha;
    ctx.save();
    super.render(alpha, ap);
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, this.width, this.height);
    ctx.restore();
  }
}

/**
 * An image object.
 * @extends BaseComponent
 */
class ImageComponent extends BaseComponent {
  /**
   * @param {number} width - The width of the object
   * @param {number} height - The height of the object
   * @param {string} imageId - The ID of the HTML image element
   * @param {number} x - X-coordinate
   * @param {number} y - Y-coordinate
   * @param {number} angle - Rotation angle in degrees
   */
  constructor(width, height, imageId, x, y, angle) {
    super(width, height, x, y, angle);
    this.image = document.getElementById(imageId);
    this.alpha = 1;
  }

  render(alpha, ap) {
    var x = this.lastX + (this.x - this.lastX) * alpha;
    var y = this.lastY + (this.y - this.lastY) * alpha;
    ctx.save();
    super.render(alpha, ap);
    //ctx.globalAlpha = this.alpha;
    ctx.drawImage(this.image, x, y, this.width, this.height);
    ctx.restore();
  }

  setImage(imageId) {
    this.image = document.getElementById(imageId);
  }
}

/**
 * A text object.
 * @extends BaseComponent
 */
class WordComponent extends BaseComponent {
  /**
   * @param {string} text - The text to display
   * @param {string} color - The color of the text
   * @param {string} font - The font and size to use
   * @param {number} x - X-coordinate
   * @param {number} y - Y-coordinate
   * @param {number} angle - Rotation angle in degrees
   */
  constructor(text, color, font, x, y) {
    super(0, 0, x, y);
    this.font = font;
    this.color = color;
    this.text = text;
  }

  render(alpha, ap) {
    ctx.save();
    super.render(alpha, ap);
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

class PlatformComponent extends BaseComponent {
  constructor(width, height, color, x, y, text, speed, angle) {
    width = 28*text.length
    super(width, height, x, y, angle);
    this.color = color;
    this.speed = speed;
    this.isPlatform = true;
    this.WordComponent = new WordComponent(text, "#28c938", "55px DotGothic16", x, y)
    //images.push(this.WordComponent)
    this.speedX = this.speed
  }
  render(alpha, ap) {
    this.speedX = this.speed
    if (this.x>3400 && this.speed>0) {
      this.speed = -this.speed;
    } else if (this.x<500 && this.speed<0) {
      this.speed = -this.speed;
    }
    var x = this.lastX + (this.x - this.lastX) * alpha;
    var y = this.lastY + (this.y - this.lastY) * alpha;
    ctx.save();
    super.render(alpha, ap);
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, this.width, this.height);
    ctx.restore();
    this.WordComponent.x = x;
    this.WordComponent.y = y+this.height
    this.update()
  }
}

/**
 * A circular component.
 * @extends BaseComponent
 */
class CircleComponent extends BaseComponent {
  /**
   * @param {number} diameter - The diameter of the circle
   * @param {string} color - The color of the object
   * @param {number} x - X-coordinate
   * @param {number} y - Y-coordinate
   * @param {number} angle - Rotation angle in degrees
   */
  constructor(diameter, color, x, y) {
    super(0, 0, x, y);
    this.diameter = diameter;
    this.color = color;
  }

  render(alpha, ap) {
    var x = this.lastX + (this.x - this.lastX) * alpha;
    var y = this.lastY + (this.y - this.lastY) * alpha;
    ctx.save();
    super.render(alpha, ap);
    ctx.beginPath();
    ctx.arc(x + (this.diameter / 2), y + (this.diameter / 2), this.diameter / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

/**
 * An arc component.
 * @extends BaseComponent
 */
class ArcComponent extends BaseComponent {
  /**
   * @param {number} diameter - The diameter of the arc
   * @param {string} color - The color of the object
   * @param {number} x - X-coordinate
   * @param {number} y - Y-coordinate
   * @param {number} angle - Rotation angle in degrees
   */
  constructor(diameter, color, x, y, startAngle, endAngle, counterClockwise = false) {
    super(0, 0, x, y, 0);
    this.diameter = diameter;
    this.color = color;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.counterClockwise = counterClockwise;
  }

  render(alpha, ap) {
    ctx.save();
    super.render(alpha, ap);
    ctx.beginPath();
    ctx.arc(this.x + (this.diameter / 2), this.y + (this.diameter / 2), this.diameter / 2, this.startAngle, this.endAngle, this.counterClockwise);
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.restore();
  }
}

/** PLAYER COMPONENT **/
class Player extends ImageComponent {
  constructor(width, height, image, x, y) {
    super(width, height, image, x, y);
    
    this.gravityStrength = 2000;
    this.jumpStrength = -1000;
    this.lastDirection = "left";
    this.HP = 100;
  }
  
  damage(dam) {
    this.HP -= dam
    const offset = 50;
    /*unanchored_guis.push({
      ["text"] : dam,
      ["life"] : 200+randRange(-100,100),
      ["start"] : Date.now(),
      ["x"] : this.x-this.width/2+randRange(-offset,offset),
      ["y"] : this.y+this.height/2+randRange(-offset,offset)
    })*/
  }

  move(x, y, ap) {
    this.x = x;
    this.y = y;
    ap.x = -x + canvas.width - (this.width / 2);
    ap.y = -y + canvas.height - (this.height / 2);
  }

  update(dt, allWalls, ap) {
    this.lastX = this.x;
    this.lastY = this.y;

    ap.lastX = ap.x;
    ap.lastY = ap.y;

    /** MOVE Y BY SPEEDY **/
    this.speedY += this.gravityStrength * dt;

    this.y += this.speedY * dt;
    ap.y -= this.speedY * dt;

    /** Y AXIS COLLISION **/
    var checkBottom = false;
    for (var i = 0; i < allWalls.length; i++) {
      if (collisionCheck(this, allWalls[i])) {
        if (this.speedY < 0) {
          this.speedY = 0;
          this.move(this.x, allWalls[i].y + allWalls[i].height + 0.01, ap);
          break;
        }

        if (this.speedY > 0) {
          this.speedY = 0;
          this.move(this.x, allWalls[i].y - this.height - 0.01, ap);
          checkBottom = true;
          break;
        }
      }
    }

    /** Y AXIS MOVEMENT (JUMPING) */
    if (gameSpace.keys && (gameSpace.keys["ArrowUp"] || gameSpace.keys["KeyW"] || gameSpace.keys["Space"])) {
      if (checkBottom) {
        this.speedY = this.jumpStrength;
        playerIsJumping = true;
      }
    }

    /** X AXIS MOVEMENT (WALKING) **/
    this.speedX = 0;

    if (gameSpace.keys && (gameSpace.keys["ArrowLeft"] || gameSpace.keys["KeyA"])) {
      this.speedX = -400 * dt;
      this.lastDirection = "left";
      if (inventory["binaryGun"] && inventory["binaryGun"]["selected"]) {
        pLeftAnim_BinaryGun.start();
      } else {
        pLeftAnim.start();
      }
    }

    if (gameSpace.keys && (gameSpace.keys["ArrowRight"] || gameSpace.keys["KeyD"])) {
      this.speedX = 400 * dt;
      this.lastDirection = "right";
      if (inventory["binaryGun"] && inventory["binaryGun"]["selected"]) {
        pRightAnim_BinaryGun.start();
      } else {
        pRightAnim.start();
      }
    }

    /** MOVE X BY SPEEDX **/
    this.x += this.speedX;
    ap.x -= this.speedX;

    /** X AXIS COLLISION **/
    for (var i = 0; i < allWalls.length; i++) {
      if (collisionCheck(this, allWalls[i])) {
        if (this.speedX < 0) {
          player.speedX = 0;
          antiPlayer.speedX = 0;
          this.move(allWalls[i].x + allWalls[i].width + 0.01, this.y, ap);
          break;
        }

        if (this.speedX > 0) {
          player.speedX = 0;
          antiPlayer.speedX = 0;
          this.move(allWalls[i].x - this.width - 0.01, this.y, ap);
          break;
        }
      }
    }

    /** LASER COLLISION **/
    for (var i = 0; i < lasers.length; i++) {
      if (collisionCheck(this, lasers[i])) {
        player.damage(5);
        lasers.splice(i, 1);
        break;
      }
    }
  }
}


/** WORM ENEMY COMPONENT **/
class WormEnemy extends ImageComponent {
  constructor(width, height, image, x, y, angle, initialDirection = 1, generation = 0) {
    super(width, height, image, x, y, angle);
    this.gravityStrength = 2000;
    this.speedX = 300 * initialDirection;
    this.animation = new AnimationController(this, ["worm000", "worm001", "worm002"], 0.15);

    this.generation = generation;

    this.hitCount = 4 - this.generation;
    this.remainingHits = this.hitCount;

    this.hitCountBg = new Component(210, 30, "rgba(0,0,0,0.5)", this.x, this.y);
    this.hitCountBar = new Component(200, 20, "rgb(0,255,0)", this.x, this.y);
  }

  render(alpha, ap) {
    super.render(alpha, ap);
    console.log(this.remainingHits/this.hitCount)
    var health = Math.max(0, Math.min(100, this.remainingHits/this.hitCount*100));
    const red = Math.min(255, 255 * ((100 - health) / 100));
    const green = Math.min(255, 255 * (health / 100));
    this.hitCountBar.color = `rgb(${Math.round(red)},${Math.round(green)},0)`
    this.hitCountBg.x = (this.x - (this.hitCountBg.width / 2)) + (this.width / 2);
    this.hitCountBg.y = this.y - 25;
    this.hitCountBar.x = (this.x - (this.hitCountBg.width / 2)) + (this.width / 2) + 5;
    this.hitCountBar.y = this.y + 5 - 25;

    this.hitCountBg.render(alpha, ap);
    this.hitCountBar.render(alpha, ap);
  }

  update(dt, allWalls) {
    this.lastX = this.x;
    this.lastY = this.y;

    this.speedY += this.gravityStrength * dt;

    this.y += this.speedY * dt;

    for (var i = 0; i < allWalls.length; i++) {
      if (collisionCheck(this, allWalls[i])) {
        if (this.speedY > 0) {
          this.speedY = 0;
          this.y = allWalls[i].y - this.height - 0.01;
          break;
        }
      }
    }

    this.x += this.speedX * dt;

    for (var i = 0; i < allWalls.length; i++) {
      if (collisionCheck(this, allWalls[i])) {
        if (this.speedX > 0) {
          this.speedX *= -1;
          this.x = allWalls[i].x - this.width - 0.01;
          break;
        }

        if (this.speedX < 0) {
          this.speedX *= -1;
          this.x = allWalls[i].x + allWalls[i].width + 0.01;
          break;
        }
      }
    }

    if (collisionCheck(this, player)) {
      player.damage(15 * dt);
    }

    this.animation.start();

    this.hitCountBg.update();
    this.hitCountBar.width = 200 * (this.remainingHits / this.hitCount);
    this.hitCountBar.update();
  }
}

/** TROJAN HORSE COMPONENT */
class TrojanHorseEnemy extends ImageComponent {
  constructor(width, height, image, x, y, angle) {
    super(width, height, image, x, y, angle);
    this.gravityStrength = 2000;
    this.speedX = 0;
    this.knockBackInfo = {
      "enabled": false,
      "startTime": 0,
      "direction": "left"
    };
    
    this.leftAnimation = new AnimationController(this, ["trojanHorseLeft000", "trojanHorseLeft001"], 0.15);
    this.rightAnimation = new AnimationController(this, ["trojanHorseRight000", "trojanHorseRight001"], 0.15);


    this.hitCount = 35;
    this.remainingHits = this.hitCount;

    this.hitCountBg = new Component(210, 30, "rgba(0,0,0,0.5)", this.x, this.y);
    this.hitCountBar = new Component(200, 20, "rgb(0,255,0)", this.x, this.y);

    this.spear = new ImageComponent(200, 30, "spearRight", this.x, this.y);
    this.spearOffset = 0;
    this.spearOffsetDirection;

    this.active = false; // start still
  }

  render(alpha, ap) {
    super.render(alpha, ap);

    if (this.active) {
      var health = Math.max(0, Math.min(100, this.remainingHits/this.hitCount*100));
      const red = Math.min(255, 255 * ((100 - health) / 100));
      const green = Math.min(255, 255 * (health / 100));
      this.hitCountBar.color = `rgb(${Math.round(red)},${Math.round(green)},0)`
      
      this.hitCountBg.x = (this.x - (this.hitCountBg.width / 2)) + (this.width / 2);
      this.hitCountBg.y = this.y - 25;
      this.hitCountBar.x = (this.x - (this.hitCountBg.width / 2)) + (this.width / 2) + 5;
      this.hitCountBar.y = this.y + 5 - 25;
  
      
      if (this.spearOffset>=100) {
        this.spearOffsetDirection = -1;
      } else if (this.spearOffset<=0) {
          this.spearOffsetDirection = 1;
      }
      this.spearOffset += 1.5 * this.spearOffsetDirection;
      this.spear.x = this.x + this.spearOffset;
      this.spear.y = this.y + (this.height / 2);
      
      if (this.speedX < 0) {
        this.spear.setImage("spearLeft")
      } else if (this.speedX > 0) {
        this.spear.setImage("spearRight")
      }
  
  
      
      this.hitCountBg.render(alpha, ap);
      this.hitCountBar.render(alpha, ap);
      this.spear.render(alpha, ap);
    }
  }

  update(dt, allWalls) {
    console.log("UPDATED HORSE")
    this.lastX = this.x;
    this.lastY = this.y;

    this.speedY += this.gravityStrength * dt;
    this.y += this.speedY * dt;

    var checkBottom = false;

    for (var i = 0; i < allWalls.length; i++) {
      if (collisionCheck(this, allWalls[i])) {
        if (this.speedY > 0) {
          this.speedY = 0;
          this.y = allWalls[i].y - this.height - 0.01;
          checkBottom = true;
          break;
        }

        if (this.speedY < 0) {
          this.speedY = 0;
          this.y = allWalls[i].y + allWalls[i].height + 0.01;
          break;
        }
      }
    }

    this.x += this.speedX * dt;

    
    for (var i = 0; i < allWalls.length; i++) {
      if (collisionCheck(this, allWalls[i])) {
        if (this.speedX > 0) {
          this.speedX *= -1;
          this.x = allWalls[i].x - this.width - 0.01;
          break;
        }

        if (this.speedX < 0) {
          this.speedX *= -1;
          this.x = allWalls[i].x + allWalls[i].width + 0.01;
          break;
        }
      }
    }

    if (this.active) {
      if (this.knockBackInfo.enabled) {
        var now = Math.floor(performance.now() / 1000)
        if (this.knockBackInfo.direction == "left") {
          this.speedX = -800
        } else {
          this.speedX = 800
        }
        if (now - this.knockBackInfo.startTime > 0.3) {
          this.knockBackInfo.enabled = false;
          this.knockBackInfo.startTime = 0;
          console.log("KNOCKBACK ENDED!")
        }
      } else {
        if (this.x > player.x + player.width) {
          this.leftAnimation.start();
          this.speedX = -300;
        } else if (this.x < player.x - player.width) {
          this.rightAnimation.start();
          this.speedX = 300;
        } else {
          this.speedX = 0;
        }
      }
  
      // if (this.y+this.height<player.y) {
      //   if (checkBottom) {
      //     this.speedY = -1000;
      //   }
      // }
  
      if (this.y > player.y) {
        if (checkBottom) {
          this.speedY = -1000;
        }
      }
  
      if (collisionCheck(this, player)) {
        player.damage(25 * dt);
      }

      this.hitCountBg.update();
      this.hitCountBar.width = 200 * (this.remainingHits / this.hitCount);
      this.hitCountBar.update();
      this.spear.update();
    }
  }
}

/** EVIL PLAYER COMPONENT */
class EvilPlayerEnemy extends ImageComponent {
  constructor(width, height, image, x, y, angle) {
    super(width, height, image, x, y, angle);
    this.gravityStrength = 2000;
    this.speedX = 200;
    this.leftAnimation = new AnimationController(this, ["evilPlayerLeft000", "evilPlayerLeft001"], 0.15);
    this.rightAnimation = new AnimationController(this, ["evilPlayerRight000", "evilPlayerRight001"], 0.15);

    this.knockBackInfo = {
      "enabled": false,
      "startTime": 0,
      "direction": "left"
    };

    this.hitCount = 65;
    this.remainingHits = this.hitCount;

    this.hitCountBg = new Component(210, 30, "rgba(0,0,0,0.5)", this.x, this.y);
    this.hitCountBar = new Component(200, 20, "rgb(0,255,0)", this.x, this.y);

    this.laserCooldown = 1.5; // 3 seconds
    this.laserTimer = this.laserCooldown;
  }

  render(alpha, ap) {
    super.render(alpha, ap);
    var health = Math.max(0, Math.min(100, this.remainingHits/this.hitCount*100));
    const red = Math.min(255, 255 * ((100 - health) / 100));
    const green = Math.min(255, 255 * (health / 100));
    this.hitCountBar.color = `rgb(${Math.round(red)},${Math.round(green)},0)`
    
    this.hitCountBg.x = (this.x - (this.hitCountBg.width / 2)) + (this.width / 2);
    this.hitCountBg.y = this.y - 25;
    this.hitCountBar.x = (this.x - (this.hitCountBg.width / 2)) + (this.width / 2) + 5;
    this.hitCountBar.y = this.y + 5 - 25;

    this.hitCountBg.render(alpha, ap);
    this.hitCountBar.render(alpha, ap);
  }

  update(dt, allWalls) {
    this.lastX = this.x;
    this.lastY = this.y;

    this.speedY += this.gravityStrength * dt;

    this.y += this.speedY * dt;

    var checkBottom = false;

    for (var i = 0; i < allWalls.length; i++) {
      if (collisionCheck(this, allWalls[i])) {
        if (this.speedY > 0) {
          this.speedY = 0;
          this.y = allWalls[i].y - this.height - 0.01;
          checkBottom = true;
          break;
        }

        if (this.speedY < 0) {
          this.speedY = 0;
          this.y = allWalls[i].y + allWalls[i].height + 0.01;
          break;
        }
      }
    }

    this.x += this.speedX * dt;

    for (var i = 0; i < allWalls.length; i++) {
      if (collisionCheck(this, allWalls[i])) {
        if (this.speedX > 0) {
          this.speedX *= -1;
          this.x = allWalls[i].x - this.width - 0.01;
          break;
        }

        if (this.speedX < 0) {
          this.speedX *= -1;
          this.x = allWalls[i].x + allWalls[i].width + 0.01;
          break;
        }
      }
    }

    if (this.knockBackInfo.enabled) {
      var now = Math.floor(performance.now() / 1000)
      if (this.knockBackInfo.direction == "left") {
        this.speedX = -800
      } else {
        this.speedX = 800
      }
      if (now - this.knockBackInfo.startTime > 0.3) {
        this.knockBackInfo.enabled = false;
        this.knockBackInfo.startTime = 0;
        console.log("KNOCKBACK ENDED!")
      }
    } else {
      if (this.x > player.x + player.width / 2) {
        this.leftAnimation.start();
        this.speedX = -200;
      } else if (this.x < player.x - player.width / 2) {
        this.rightAnimation.start();
        this.speedX = 200;
      } else {
        this.speedX = 0;
      }
    }
    

    // if (this.y+this.height<player.y) {
    //   if (checkBottom) {
    //     this.speedY = -1000;
    //   }
    // }

    if (this.y > player.y) {
      if (checkBottom) {
        this.speedY = -1000;
      }
    }

    if (collisionCheck(this, player)) {
      player.damage(20 * dt);
    }

    // LASER

    if (this.laserTimer > 0) this.laserTimer -= dt;

    if (this.laserTimer <= 0) {
      this.laserTimer = this.laserCooldown;
      
      var laser = new Component(50, 20, "rgb(255,0,0)", this.x+this.width/2, this.y+this.height/4);
      if (this.speedX < 0) {
        laser.speedX = -2000 * dt;
      } else {
        laser.speedX = 2000 * dt;
      }

      lasers.push(laser);
    }
    


    this.hitCountBg.update();
    this.hitCountBar.width = 200 * (this.remainingHits / this.hitCount);
    this.hitCountBar.update();
  }
}


/** 
 * Used to animate components
 */
class AnimationController {
  static #activeAnim = false;

  static setActiveAnim(value) {
    this.#activeAnim = value;
  }

  static getActiveAnim() {
    return this.#activeAnim;
  }

  /** 
   * @param {BaseComponent} component - The component to animate
   * @param {Array} pictures - A list of strings pointing to each frame's image file
   * @param {number} interval - How quick each frame should change
   */
  constructor(component, pictures, interval) {
    this.component = component;
    this.pictures = [...pictures];
    this.interval = interval;
    this.timer = 0;
    this.animInterval;
    this.ogImage = component.image;
    this.currentFrame = 0;
  }

  /** 
   * Increments the current animation frame by one. Should be called in update.
   */
  start() {
    this.timer += (dt);

    this.component.setImage(this.pictures[this.currentFrame]);

    if ((this.currentFrame < this.pictures.length) && this.timer >= this.interval) {
      this.timer = 0;
      this.currentFrame++;
      //console.log(this.currentFrame);
    }

    if (this.currentFrame == this.pictures.length) {
      this.currentFrame = 0;
      this.constructor.setActiveAnim(false);
    }
  }
}