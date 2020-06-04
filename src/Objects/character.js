import 'phaser';
import Unit from '../Objects/Unit';

export default class Player extends Unit {
  constructor(scene, x = 50, y = 100, hp = 100, atk = 10, def = 0, mod_hp = 0, mod_atk = 0, mod_def = 0) {
    super(scene, x, y, hp, atk, def, mod_hp, mod_atk, mod_def, 'adventurer');
    this.cursor = scene.input.keyboard.createCursorKeys();
    this.idleConfig = {
      delay: 1000 * 5,
      callback: this.toggleIddle,
      callbackScope: this
    };
    this.idleConfig = {
      delay: 1000 * 5,
      callback: this.toggleIddle,
      callbackScope: this
    };
    this.initAnimation();
    this.timer = this.scene.time.addEvent(this.idleConfig);
  };

  initAnimation() {
    this.scene.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNumbers('adventurer', {
        start: 16,
        end: 22
      }),
      frameRate: 10,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNumbers('adventurer', {
        start: 0,
        end: 12
      }),
      frameRate: 6,
      repeat: false
    });
  };

  playWalking() {
    this.unit.anims.play('walk', true);
    this.walking = true;
  };

  // movingSprite will adjust the moving sprite according to direction / speed
  // Keep in mind that for now I am adjusting it with scale, care.

  movingSprite(x = 0, y = 0, sx = 1, sy = 1, flip = true) {
    this.playWalking();
    super.movingSprite(x, y, sx, sy, flip);
  };

  move(delta) {
    if (this.cursor.down.isDown) {
      this.movingSprite(0, 70, -1, 1, true);
      this.timer.reset(this.idleConfig);
      return true;
    }
    if (this.cursor.left.isDown) {
      this.movingSprite(-70, 0, -1, 1, true);
      this.timer.reset(this.idleConfig);
      return true;
    }
    if (this.cursor.up.isDown) {
      this.movingSprite(0, -70, 1, 1, false);
      this.timer.reset(this.idleConfig);
      return true;
    }
    if (this.cursor.right.isDown) {
      this.movingSprite(70, 0, 1, 1, false);
      this.timer.reset(this.idleConfig);
      return true;
    }
    if (this.walking) {
      this.unit.anims.stop();
      this.unit.setFrame(0);
      this.walking = false;
    }
    this.unit.setVelocityX(0);
    this.unit.setVelocityY(0);
  };

  toggleIddle() {
    this.unit.play('idle');
    this.timer = this.scene.time.addEvent(this.idleConfig);
  };

  setCamera() {
    this.scene.cameras.main.startFollow(this.unit);
    this.scene.cameras.main.roundPixels = true;
  }

  update() {
    this.move();
  };
};
