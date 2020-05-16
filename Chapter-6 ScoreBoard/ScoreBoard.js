import { Text, TextStyle } from 'pixi.js'

export default class ScoreBoard {
  constructor(config) {
      this._config = config;
      this._value = 0;
      this._createText();
  }

  get scoreValue() {
    return this.score.text;
  }

  update(value = 1) {
      this._value += value;
      this.score.text = this._value;
  }

  reset() {
      this._value = 0;
      this.score.text = this._value;
  }

  _createText() {
    // Styles to be used for the font
    const styleData = {
      fill: "#a21631",
      fontSize: 20,
      fontFamily: "\"Times New Roman\", Times, serif",
      fontWeight: "bold",
    };

    const style = new TextStyle(styleData);
    this.score = new Text(`${this._value}`, style);
    
    // Hardcoded values
    const pos = {
      x: 632,
      y: 26,
    }
    this.score.x = pos.x;
    this.score.y = pos.y;
  }
}