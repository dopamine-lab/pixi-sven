import { Sprite, Application } from 'pixi.js';
import config from '../config';
import Game from '../Game';
import { Viewport } from 'pixi-viewport';
import { center } from './utils';
import Assets from './AssetManager';

/**
 * Game entry point. Holds the game's viewport
 * All configurations are described in src/config.js
 */
export default class GameApplication extends Application {
  constructor() {
    super(config.view);

    this.config = config;
    Assets.renderer = this.renderer;

    this.setupViewport();

    this.loadAssets().then(() => this.initGame());
  }

  /**
   * Load all images and sounds
   */
  async loadAssets() {
    await Assets.load({ images: Assets.images, sounds: Assets.sounds });
  }

  /**
   * Game main entry point. Loads and prerenders assets.
   * Creates the main game container.
   *
   */
  async initGame() {
    this.game = new Game();
    this.viewport.addChild(this.game);

    this.game.start();
  }

  /**
     * Initialize the game world viewport.
     * Supports handly functions like dragging and panning on the main game stage
     *
     * @return {PIXI.Application}
     */
  setupViewport() {
    const viewport = new Viewport({
      screenWidth: this.config.view.width,
      screenHeight: this.config.view.height,
      worldWidth: this.config.game.width,
      worldHeight: this.config.game.height,
      // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
      interaction: this.renderer.plugins.interaction,
    });

    document.body.appendChild(this.view);

    this.stage.addChild(viewport);

    if (this.config.game.drag) viewport.drag();
    if (this.config.game.pinch) viewport.pinch();
    if (this.config.game.wheel) viewport.wheel();
    if (this.config.game.decelerate) viewport.decelerate();

    this.viewport = viewport;
  }
}

