import { Container, Sprite } from 'pixi.js';
import svenAnimations from './svenAnimations';
import sheepAnimations from './sheepAnimations';
import Entity from './Entity';
import Map from './Map';
import Sven from './Sven';
import gsap from 'gsap';
import ScoreBoard from './ScoreBoard';
import Timer from './Timer';
// Import the EndScreen
import EndScreen from './EndScreen';

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
    this._scoreBoard = new ScoreBoard();
    this._timer = new Timer();
    // initialize the EndScreen
    this._endScreen = new EndScreen();
    this._herd = [];
  }

  async start() {
    this._attachKeyboardListeners();

    this.addChild(Sprite.from('background'));
    this.addChild(this._scoreBoard.score);
    this.addChild(this._timer.timerText);
    this._createSven();
    this._createHerd();
    // Add the end screen to the game
    this.addChild(this._endScreen);
    this._timer.start(() => this._onEnd());
  }

  _createSven() {
    const svenMapPos = this._map.posById(this._map.IDS.SVEN)[0];
    const svenCoords = this._map.coordsFromPos(svenMapPos);

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
    if (!hitSheep) return this._sven.standStill();

    const sheep = this._herd.find(s => s.row === targetPos.row && s.col === targetPos.col);
    if (this._sven.direction !== sheep.direction) return this._sven.standStill();

    if (this._sven.isHumping) return this._sven.standStill();

    if (sheep.humpedCount >= 4) return this._sven.standStill();

    sheep.anim.visible = false;

    this._scoreBoard.update(3); // 3 points

    this._sven.hump(() => {
      sheep.humpedCount++;
      sheep.anim.visible = true;
      this._sven.standStill();
      if (sheep.humpedCount >= 4) { 
        // Pass callback function to check if we have reached the end of the game
        this._removeSheep(sheep, () => {
          if (this._herd.length === 0) return this._onEnd();
        })
      }

      this._svenAction();
    });
  }

  _removeSheep(sheep, callback) {
    gsap.to(sheep.anim, {
      alpha: 0.4,
      duration: 0.5,
      repeat: 3,
      yoyo: true,
      onComplete: () => {
        sheep.anim.textures = sheep.animations['disappear'];
        sheep.anim.gotoAndPlay(0);
        sheep.anim.onComplete = () => {
          const sheepIndex = this._herd.indexOf(sheep);
          this._herd.splice(sheepIndex, 1);
          this.removeChild(sheep.anim);
          this._map.setTileOnMap({row: sheep.row, col: sheep.col}, this._map.IDS.EMPTY);
          callback();
          sheep.anim.onComplete = null; // Detach the listener
        };
      }
    });
  }

  _onEnd() {
    const score = this._scoreBoard.scoreValue;
    const win = this._herd.length === 0;
    // Show the End screen
    this._endScreen.show(score, win);
  }

}
