import { Scene } from 'phaser';
import { MapLayout } from '../../types/MapTypes';
import { Player } from '../../entities/Player';
import { EnemyManager } from '../enemies/EnemyManager';

export class MapLoader {
    private scene: Scene;
    private enemyManager: EnemyManager;
    private platforms: Phaser.GameObjects.GameObject[] = [];
    private player: Player;

    constructor(scene: Scene, player: Player) {
        this.scene = scene;
        this.player = player;
        this.enemyManager = new EnemyManager(scene, player);
    }

    loadMap(layout: MapLayout): void {
        layout.backgrounds.forEach(background => {
            this.scene.add.tileSprite(
                background.x,
                background.y,
                background.width,
                background.height,
                background.type
            ).setOrigin(0, 0);
        });

        layout.decorations.forEach(decoration => {
            this.scene.add.image(decoration.x, decoration.y, decoration.type)
               .setOrigin(0, 1); // Origen en la base de la decoración
        });

        // Cargar edificios
        layout.buildings.forEach(building => {
            this.scene.add.image(building.x, building.y, building.type)
                .setOrigin(0, 1); // Origen en la base del edificio
        });

        // Cargar plataformas
        layout.platforms.forEach(platform => {
            const platformSprite = this.scene.add.tileSprite(
                platform.x,
                platform.y,
                platform.width,
                platform.height ?? 64,
                platform.type
            ).setOrigin(0, 0);

            this.scene.physics.add.existing(platformSprite, true);
            this.platforms.push(platformSprite);
        });

        // Crear enemigos
        layout.spawnPoints.enemies.forEach(enemySpawn => {
            this.enemyManager.createEnemy(enemySpawn);
        });

        // Configurar colisiones de las plataformas con el jugador
        this.platforms.forEach(platform => {
            this.scene.physics.add.collider(this.player, platform);
        });

        // Configurar colisiones de enemigos
        this.enemyManager.setupCollisions(this.platforms);
    }

    update(): void {
        this.enemyManager.update();
    }

    public getEnemyManager(): EnemyManager {
        return this.enemyManager;
    }
}