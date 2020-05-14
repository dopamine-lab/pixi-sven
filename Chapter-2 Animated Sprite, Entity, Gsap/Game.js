import { Container, Sprite } from 'pixi.js';
import svenAnimations from './svenAnimations';
import Entity from './Entity';

/**
 * Main game stage, manages scenes/levels.
 *
 * @extends {PIXI.Container}
 */
export default class Game extends Container {
  constructor() {
    super();
  }

  async start() {
    this._attachKeyboardListeners();

    this.addChild(Sprite.from('background'));
    this._createSven();
  }

  _createSven() {
    // The new here is that we use Entity class which we created to init our Sven
    this._sven = new Entity(svenAnimations);
    this._sven.init();
    this.addChild(this._sven.anim); // We pass the new anim which we created
  }

  _attachKeyboardListeners() {
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    document.addEventListener('keyup', this._onKeyUp.bind(this));
  }


  _onKeyDown(e) {
    console.error(e.code, 'is pressed');
    // we use the Entity move method which we created
    this._sven.move();
  }

  _onKeyUp(e) {
    console.error(e.code, ' is released.');
  }
}
