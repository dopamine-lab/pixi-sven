import { Container, Sprite } from 'pixi.js';

export default class Game extends Container {
  constructor() {
    super();
  }

  async start() {
    this._attachKeyboardListeners();

    // Create our first sprite
    this.addChild(Sprite.from('background'));
    this._createSven();
  }

  _createSven() {
    // Create sven sprite
    this._sven = Sprite.from('svenLeft');
    this.addChild(this._sven);
  }

  _attachKeyboardListeners() {
    // Attach our keyboard listeners
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    document.addEventListener('keyup', this._onKeyUp.bind(this));
  }

  _onKeyDown(e) {
    console.error(e.code, 'is pressed');
    // Adjust some positions
    this._sven.x += 5;
  }

  _onKeyUp(e) {
    console.error(e.code, ' is released.');
  }
}
