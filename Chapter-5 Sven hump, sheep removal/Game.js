import { Container, Sprite } from 'pixi.js';
import svenAnimations from './svenAnimations';
import sheepAnimations from './sheepAnimations';
import Entity from './Entity';
import Map from './Map';
// Import new Sven class
import Sven from './Sven';
import gsap from 'gsap';


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
    this._herd = [];
  }

  async start() {
    this._attachKeyboardListeners();

    this.addChild(Sprite.from('background'));
    this._createSven();
    this._createHerd();
  }

  _createSven() {
    const svenMapPos = this._map.posById(this._map.IDS.SVEN)[0];
    const svenCoords = this._map.coordsFromPos(svenMapPos);

    // Instantiate the new Sven class
    this._sven = new Sven(svenAnimations);
    this._sven.init(svenCoords);
    this.addChild(this._sven.anim);
  }

  _createHerd() {
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
    if (this._pressedKeys.includes(e.code)) return;
    
    this._pressedKeys.push(e.code);
    this._svenAction();
  }

  _onKeyUp(e) {
    this._pressedKeys.splice(this._pressedKeys.indexOf(e.code), 1); // no checks ftw
  }

  _svenAction() {
    if (this._sven.moving) return;

    const directionKey = this._pressedKeys.find(k => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(k));

    if (directionKey) {
      const direction = directionKey.replace('Arrow', '');
      return this._svenMove(direction);
    }

    // Hump if the space is pressed
    if (this._pressedKeys.includes('Space')) {
      return this._svenHump();
    }

    this._sven.standStill();
  }

  async _svenMove(direction) {
    let oldPos = this._map.posById(this._map.IDS.SVEN)[0];
    let newPos = this._map.getDestination(oldPos, direction);

    if (this._map.outOfBounds(newPos) || this._map.collide(newPos)) return this._sven.standStill(direction);

    const targetPos = this._map.coordsFromPos(newPos);
    await this._sven.move(targetPos, direction);

    this._map.setTileOnMap(oldPos, this._map.IDS.EMPTY);
    this._map.setTileOnMap(newPos, this._map.IDS.SVEN);

    this._svenAction();
  }

  _svenHump() {
    const svenDirection = this._sven.direction;
    const svenPos = this._map.posById(this._map.IDS.SVEN)[0];
    const targetPos = this._map.getDestination(svenPos, svenDirection);

    const hitSheep = this._map.getTile(targetPos) === this._map.IDS.SHEEP;
    // Check if we hit sheep
    if (!hitSheep) return this._sven.standStill();

    const sheep = this._herd.find(s => s.row === targetPos.row && s.col === targetPos.col);
    // Check if the sheep and Sven are looking at the same direction
    if (this._sven.direction !== sheep.direction) return this._sven.standStill();

    if (this._sven.isHumping) return this._sven.standStill();

    if (sheep.humpedCount >= 4) return this._sven.standStill();

    sheep.anim.visible = false;

    // Use the new hump method
    this._sven.hump(() => {
      sheep.humpedCount++;
      sheep.anim.visible = true;
      this._sven.standStill();
      if (sheep.humpedCount >= 4) { this._removeSheep(sheep)}

      this._svenAction();
    });
  }

  _removeSheep(sheep) {
    // Play the blink sheep animation before disappearing
    gsap.to(sheep.anim, {
      alpha: 0.4,
      duration: 0.5,
      repeat: 3,
      yoyo: true,
      onComplete: () => {
        sheep.anim.textures = sheep.animations['disappear'];
        sheep.anim.gotoAndPlay(0);
        sheep.anim.onComplete = () => {
          // Remove the sheep from the data
          const sheepIndex = this._herd.indexOf(sheep);
          this._herd.splice(sheepIndex, 1);
          this.removeChild(sheep.anim);
          this._map.setTileOnMap({row: sheep.row, col: sheep.col}, this._map.IDS.EMPTY);
          sheep.anim.onComplete = null; // Detach the listener
        };
      }
    });
  }

}
