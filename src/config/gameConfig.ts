import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { LoadingScene } from '../scenes/LoadingScene';
import { MainMenuScene } from '../scenes/MainMenuScene';
import { GameScene } from '../scenes/GameScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#000000',
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  dom: {
    createContainer: true
  },
  scale: {
    mode: Phaser.Scale.ENVELOP,
    autoCenter: Phaser.Scale.ENVELOP,
    width: 1920,
    height: 1080,
    autoRound: true,
    min: {
      width: 1280,
      height: 720
    },
    max: {
      width: 1920,
      height: 1080
    }
  },
  scene: [BootScene, LoadingScene, MainMenuScene, GameScene]
};