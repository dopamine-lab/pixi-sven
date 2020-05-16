import Entity from './Entity';

export default class Sven extends Entity {
  constructor(config, animations) {
    super(config, animations);
    this.isHumping = false;
  }

  hump(callback) {
    this.isHumping = true;
    this.anim.textures = this.animations['hump' + this.direction];
    this.anim.gotoAndPlay(0);
    
    this.anim.onComplete = () => {
      this.anim.onComplete = null; // Detach the listener
      this.isHumping = false;
      callback();
    };

  }
}