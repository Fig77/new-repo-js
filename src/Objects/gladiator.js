import 'phaser';
import Unit from '../Objects/Unit';

export default class Gladiator extends Unit {
  constructor(scene, x = 1489.0000000000239, y = 100, hp = 400, atk = 20, def = 5, mod_hp = 0, mod_atk = 0, mod_def = 0, text = 'gladiator') {
    super(scene, x, y, hp, atk, def, mod_hp, mod_atk, mod_def, text);
    this.initAnimation();
    this.timer = this.scene.time.addEvent(this.idleConfig);
    this.text = text;
    this.kill = scene.player;
    this.attack_range = 5;
    this.speed = 60;
    this.dire = 1;
    this.unit.body.setImmovable(true);
    this.dX = 0;
    this.last = {
      x: x,
      y: y
    };
    this.pacmanQueue = [this.followX, this.followY];
  };

  initAnimation() {
    this.scene.anims.create({
      key: 'walkG',
      frames: this.scene.anims.generateFrameNumbers('gladiator', {
        start: 9,
        end: 15
      }),
      frameRate: 10,
      repeat: -1
    });
  };

  playWalking() {
    this.unit.anims.play('walkG', true);
    this.walking = true;
  };

  agroTarget() {
    if ((Math.abs(this.kill.unit.x - this.unit.x) < 150 && (Math.abs(this.kill.unit.x - this.unit.x) < 150)) && this.agroed === false) {
      this.speed += 45;
      this.agroed = true;
    } else {
      this.cathTarget((this.kill.unit.x - this.unit.x), (this.kill.unit.y - this.unit.y));
    }
  };

  cathTarget(dx, dy) {
    let flip = 1;
    let bolflip = false;
    this.movingSprite(movx, movy, flip, 1, false);
  }

  // movingSprite will adjust the moving sprite according to direction / speed
  // Keep in mind that for now I am adjusting it with scale, care.

  movingSprite(x = 0, y = 0, sx = 1, sy = 1, flip = true) {
    this.playWalking();
    super.movingSprite(x, y, sx, sy, flip);
  };

  move(delta) {
    switch (delta) {
      case 3:
        this.movingSprite(0, this.speed, -1, 1, true);
        return true;
        break;
      case (-2):
        this.movingSprite(-1 * this.speed, 0, -1, 1, true);
        return true;
        break;
      case (-3):
        this.movingSprite(0, -1 * this.speed, 1, 1, false);
        return true;
        break;
      case 2:
        this.movingSprite(this.speed, 0, 1, 1, false);
        return true;
        break;
      default:
        // code block
    }
    if (this.walking) {
      this.unit.anims.stop();
      this.unit.setFrame(0);
      this.walking = false;
    }
    this.stop();
  }

  stop() {
    super.stop();
    this.walking = false;
    this.unit.anims.stop();
    this.unit.setFrame(0);
  }

  getOrtogonalDistance() {
    let x = this.kill.unit.x - this.unit.x;
    let y = this.kill.unit.y - this.unit.y;
    return {
      x,
      y
    };
  };

  direCollide() {
    if (this.unit.body.blocked.left === false || this.unit.body.blocked.right === false) {
      return 1;
    }
    if (this.unit.body.blocked.up === false || this.unit.body.blocked.down === false) {
      return 2;
    }
  }

  followY(distance) {
    if (this.unit.body.blocked.up === true || this.unit.body.blocked.down === true) {
      let aux = this.pacmanQueue.shift();
      this.pacmanQueue.push(aux);
      return true;
    } else {
      if (Math.abs(Math.round(distance.y)) >= 1) {
        this.move((distance.y / Math.abs(distance.y)) * 3);
        return true;
      } else {
        let aux = this.pacmanQueue.shift();
        this.pacmanQueue.push(aux);
      }
    }
    return false;
  };

  followX(distance) {
    if (this.unit.body.blocked.left === true || this.unit.body.blocked.right === true) {
      let aux = this.pacmanQueue.shift();
      this.pacmanQueue.push(aux);
      return true;
    } else {
      if (Math.abs(Math.round(distance.x)) >= 1) {
        this.move((distance.x / Math.abs(distance.x)) * 2);
        return true;
      } else {
        let aux = this.pacmanQueue.shift();
        this.pacmanQueue.push(aux);
      }
    }
    return false;
  };


  chase() {
    let distance = this.getOrtogonalDistance();
    this.qElement = this.pacmanQueue[0];
    if (this.qElement(distance)) {
      return true;
    }
    this.stop();
  }

  update() {
    this.chase();
  };
};