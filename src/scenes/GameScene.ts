import { Scene } from 'phaser';
import { Player } from '../entities/Player';
import { MapLoader } from '../systems/map/MapLoader';
import { MapLayout } from '../types/MapTypes';
import { medievalMap1Layout } from '../config/maps/medieval_map_1';

export class GameScene extends Scene {
    private player!: Player;
    private currentMap: MapLayout | null;
    private mapLoader!: MapLoader;

    public getMapLoader(): MapLoader {
        return this.mapLoader;
    }

    constructor() {
        super({ key: 'GameScene' });
    }

    init(data: { map: MapLayout }): void {
        this.currentMap = data.map || medievalMap1Layout;
        if (!this.currentMap) {
            console.error('Mapa no encontrado:', data.map);
            this.scene.start('MapSelectionScene');
            return;
        }
    }

    create(): void {
        // Verificamos que el teclado esté disponible
        if (!this.input.keyboard) {
            console.error('Keyboard not available');
            return;
        }

        if (this.currentMap && this.currentMap.spawnPoints) {
            const spawnPoint = this.currentMap.spawnPoints.player;
            this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        } else {
            // Punto de spawn por defecto si no está definido
            this.player = new Player(this, this.cameras.main.centerX, this.cameras.main.centerY);
        }
        
        // Inicializamos el MapLoader después de crear el jugador
        this.mapLoader = new MapLoader(this, this.player);

        // Configuramos la cámara para que siga al jugador
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setZoom(1.1);

        if (this.currentMap) {
            this.mapLoader.loadMap(this.currentMap);
        }
    }

    update(): void {
        if (!this.player) return;
        this.player.update();
        this.mapLoader.update();
    }
}