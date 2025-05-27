import { Game } from 'phaser';
import { gameConfig } from '../config/gameConfig';

export default function createGame(): Game {
    const config = {
        ...gameConfig,
    };

    return new Game(config);
}
