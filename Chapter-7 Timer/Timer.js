import { Text, TextStyle } from 'pixi.js'

export default class Timer {
  constructor() {
      this._minDuration = 75
      this._maxDuration = 145;
      // Get random level duration
      this._levelSeconds = this._getRandomInt(this._minDuration, this._maxDuration);
      this._createText();
  }

  get minutesLeft() {
    return Math.floor(this._levelSeconds / 60);
  }

  get secondsLeft() {
    const seconds = this._levelSeconds - this.minutesLeft * 60;
    if (seconds < 10) return '0' + seconds;
    else return seconds
  }

  start(onCountDownEnd) {
    // Start an interval to coundown the seconds
    this.countDown = setInterval(() => {
      if (this._levelSeconds === 0) {
        onCountDownEnd();
        return this.stop();
      };

      this._levelSeconds--;
      this.timerText.text = `${this.minutesLeft}:${this.secondsLeft}`
    }, 1000);
  }

  stop() {
    // Clear the current interval
    clearInterval(this.countDown);
  }

  restart() {
    // Restart the timer
    this.stop();
    this._levelSeconds = this._getRandomInt(this._minDuration, this.__maxDuration);
    this.start();
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
    this.timerText = new Text(`${this.minutesLeft}:${this.secondsLeft}`, style);
    
    // Hardcoded values
    const pos = {
      x: 42,
      y: 38,
    };
  
    this.timerText.x = pos.x;
    this.timerText.y = pos.y;
  }

  _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}