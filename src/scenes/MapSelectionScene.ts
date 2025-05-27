import { Scene } from 'phaser';
import { GAME_MAPS } from '../config/maps';
import { MapLayout } from '../types/MapTypes';

export class MapSelectionScene extends Scene {
    constructor() {
        super({ key: 'MapSelectionScene' });
    }

    create(): void {
        const { width } = this.cameras.main;

        // Título
        this.add.text(width / 2, 100, 'Selecciona tu Mapa', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Crear botones para cada mapa
        GAME_MAPS.forEach((map, index) => {
            const x = width / 2;
            const y = 200 + (index * 120);

            // Contenedor del mapa
            const container = this.add.container(x, y);

            // Fondo del botón
            const background = this.add.rectangle(0, 0, 400, 100, 0x666666);
            if (!map.isUnlocked) {
                background.setFillStyle(0x333333);
            }

            // Nombre del mapa
            const text = this.add.text(0, 0, map.name, {
                fontSize: '24px',
                color: map.isUnlocked ? '#ffffff' : '#888888'
            }).setOrigin(0.5);

            container.add([background, text]);

            if (map.isUnlocked) {
                background.setInteractive()
                    .on('pointerover', () => background.setFillStyle(0x888888))
                    .on('pointerout', () => background.setFillStyle(0x666666))
                    .on('pointerdown', () => this.startMap(map));
            }
        });
    }

    private startMap(map: MapLayout): void {
        // Pasar el ID del mapa a la escena del juego
        this.scene.start('GameScene', { map });
    }
}