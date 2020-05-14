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
    // Use the coordinates obtained by the map for propper position
    this.anim.position = position;
  }

  async move() {
    this.moving = true;

    await gsap.to(this.anim, {
        duration: 0.5,
        x: '+=5',
        ease: "none"
    });
    
    this.moving = false;
  }
}