import {Loader, AnimatedSprite} from 'pixi.js';
import gsap from 'gsap';

const Resources = Loader.shared.resources;
const DIRECTIONS = ['Up', 'Down', 'Left', 'Right'];

export default class Entity  {
  constructor(animations) {
      this.animations = [];

      const randomIndex = Math.floor(Math.random() * DIRECTIONS.length);
      this.direction = DIRECTIONS[randomIndex];

      this.moving = false;

      this.prepareAnimations(animations);
  }

  /**
   * 
   * @param {{}} animations containing all animations info
   */
  prepareAnimations(animations) {
    for (let animKey in animations) {
      const animationTextures = [];
      
      animations[animKey].forEach((sprite) => {
        animationTextures.push(Resources[sprite].texture)
      });
      this.animations[animKey] = animationTextures;
    }
  }

  /**
   * 
   * @param {x,y} position coordinates 
   */
  async init(position) {
    this.anim = new AnimatedSprite(this.animations[`stand${this.direction}`]);
    this.anim.position = position;
    // Adjust animation speed
    this.anim.animationSpeed = 0.2;
    // Don't loop it at initial state
    this.anim.loop = false;
  }

  /**
   * 
   * @param {String} direction 'Up', 'Down' etc.
   */
  standStill(direction = this.direction) {
    this.direction = direction;
    this.anim.textures = this.animations[`stand${this.direction}`];
    this.anim.gotoAndStop(0);
    this.moving = false;
  }

  /**
   * 
   * @param {{x, y}} target coordinates 
   * @param {String} direction 'Up', 'Down' etc.
   */
  async move(target, direction) {
    this.moving = true;

    // Adjust the new direction
    this.direction = direction;
    // Adjust the animation based on the direction
    this.anim.textures = this.animations['walk' + direction];
    // Play the animation
    this.anim.gotoAndPlay(0);

    await gsap.to(this.anim, {
      duration: 0.5,
      x: target.x,
      y: target.y,
      ease: "none"
  });
    
    this.moving = false;
  }
}