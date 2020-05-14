import { Container, Sprite } from 'pixi.js';
import svenAnimations from './svenAnimations';
import Entity from './Entity';
import Map from './Map';

/**
 * Main game stage, manages scenes/levels.
 *
 * @extends {PIXI.Container}
 */
export default class Game extends Container {
  constructor() {
    super();
    // Initialize our map
    this._map = new Map();
  }

  async start() {
    this._attachKeyboardListeners();

    this.addChild(Sprite.from('background'));
    this._createSven();
  }

  _createSven() {
    // Use the map methods to properly position our Sven, based on the map position
    const svenMapPos = this._map.posById(this._map.IDS.SVEN)[0];
    const svenCoords = this._map.coordsFromPos(svenMapPos);

    this._sven = new Entity(svenAnimations);
    this._sven.init(svenCoords);
    this.addChild(this._sven.anim);
  }

  _attachKeyboardListeners() {
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    document.addEventListener('keyup', this._onKeyUp.bind(this));
  }


  _onKeyDown(e) {
    console.error(e.code, 'is pressed');
    this._sven.move();
  }

  _onKeyUp(e) {
    console.error(e.code, ' is released.');
  }
}
