import { Container, Text, TextStyle, Loader, Sprite } from 'pixi.js';
const Resources = Loader.shared.resources;

const Texts = {
  YOU_WIN: 'Congratulations you win!',
  YOU_LOOSE: 'Game over, you lose!'
};

export default class EndScreen extends Container {
  constructor() {
    super();
    this.visible = false;
    this._createBackground();
    this._createText();
  }

  /**
   * 
   * @param {int} score 
   * @param {boolean} win 
   */
  show(score, win) {
    this.visible = true;
    this._updateTexts(score, win);
  }

  hide() {
    this.visible = false;
  }

  _updateTexts(score, win) {
    this.label.text = win === true ? Texts.YOU_WIN : Texts.YOU_LOOSE;

    this.score.text = `Score: ${score}`;
  }

  _createText() {
    const style = new TextStyle({
        fontFamily: "Comic Sans MS, sans-serif",
        fontSize: 30,
        fontWeight: "bold",
        fill: "white",
      });

    this.label = new Text(`${Texts.YOU_WIN}`, style);
    this.label.x = 350;
    this.label.y = 300;

    this.score = new Text(`Score: 0`, style)
    this.score.x = 440;
    this.score.y = 350;

    this.addChild(this.label, this.score);
  }

  _createBackground() {
    const backgroundTexture = Resources.endBackground.texture;
    const background = new Sprite(backgroundTexture);
    this.addChild(background);
  }
}