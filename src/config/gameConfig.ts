import { Types } from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { LoadingScene } from '../scenes/LoadingScene';
import { MainMenuScene } from '../scenes/MainMenuScene';
import { GameScene } from '../scenes/GameScene';

export const gameConfig: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1920,  // Resolución Full HD
  height: 1080, // Resolución Full HD
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: import.meta.env.NODE_ENV === 'development'
    }
  },
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.EXPAND,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    fullscreenTarget: 'game-container',
    expandParent: true,
    max: {
      width: 1920,
      height: 1080
    }
  },
  scene: [BootScene, LoadingScene, MainMenuScene, GameScene]
};