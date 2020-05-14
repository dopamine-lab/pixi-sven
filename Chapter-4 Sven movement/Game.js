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
    this._pressedKeys = [];
    this._map = new Map();
  }

  async start() {
    this._attachKeyboardListeners();

    this.addChild(Sprite.from('background'));
    this._createSven();
  }

  _createSven() {
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
    // If the key is already pressed return, we wan't to have only one key pressed by a time
    if (this._pressedKeys.includes(e.code)) return;
    
    // On key press collect the pressed keys and call svenAction method
    this._pressedKeys.push(e.code);
    this._svenAction();
  }

  _onKeyUp(e) {
    this._pressedKeys.splice(this._pressedKeys.indexOf(e.code), 1); // no checks ftw
  }

  _svenAction() {
    // never interrupt Sven's movemnt
    if (this._sven.moving) return;

    // should we try to move Sven
    const directionKey = this._pressedKeys.find(k => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(k));

    if (directionKey) {
      const direction = directionKey.replace('Arrow', '');
      return this._svenMove(direction);
    }

    // If no key is pressed stand still
    this._sven.standStill();
  }

  async _svenMove(direction) {
    // take current and next position
    let oldPos = this._map.posById(this._map.IDS.SVEN)[0];
    let newPos = this._map.getDestination(oldPos, direction);

    // if there is a collision or sven is out of bounds make him stand still
    if (this._map.outOfBounds(newPos) || this._map.collide(newPos)) return this._sven.standStill(direction);

    // take the next coordinates
    const targetPos = this._map.coordsFromPos(newPos);
    // Move sven based on the direction and position
    await this._sven.move(targetPos, direction);

    // After the move is done , update the map positions
    this._map.setTileOnMap(oldPos, this._map.IDS.EMPTY);
    this._map.setTileOnMap(newPos, this._map.IDS.SVEN);

    // Call svenAction to check if there is another key pressed
    this._svenAction();
  }
}
