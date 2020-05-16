import { Container, Sprite } from 'pixi.js';
import svenAnimations from './svenAnimations';
import sheepAnimations from './sheepAnimations';
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
    this._herd = [];
  }

  async start() {
    this._attachKeyboardListeners();

    this.addChild(Sprite.from('background'));
    this._createSven();
    this._createHerd();
  }

  _createSven() {
    // Use the map methods to properly position our Sven, based on the map position
    const svenMapPos = this._map.posById(this._map.IDS.SVEN)[0];
    const svenCoords = this._map.coordsFromPos(svenMapPos);

    this._sven = new Entity(svenAnimations);
    this._sven.init(svenCoords);
    this.addChild(this._sven.anim);
  }

  _createHerd() {
    // use the map method to display all the sheeps for the current level
    const sheepPositions = this._map.posById(this._map.IDS.SHEEP);
    
    sheepPositions.forEach(sheepPosition => {
      const sheepCoords = this._map.coordsFromPos(sheepPosition);
      const sheep = new Entity(sheepAnimations);
      sheep.init(sheepCoords);

      sheep.col = sheepPosition.col;
      sheep.row = sheepPosition.row; 
      sheep.humpedCount = 0;

      this.addChild(sheep.anim);
      this._herd.push(sheep);
    });
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
