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

    update(): void {
        this.enemyManager.update();
    }

    loadMap(layout: MapLayout): void {
        layout.backgrounds?.forEach(background => {
            this.scene.add.tileSprite(
                background.x,
                background.y,
                background.width,
                background.height,
                background.type
            ).setOrigin(0, 0);
        });

        layout.decorations?.forEach(decoration => {
            this.scene.add.image(decoration.x, decoration.y, decoration.type)
               .setOrigin(0, 1); // Origen en la base de la decoración
        });

        // Cargar edificios
        layout.buildings?.forEach(building => {
            this.scene.add.image(building.x, building.y, building.type)
                .setOrigin(0, 1); // Origen en la base del edificio
        });

        // Cargar plataformas
        layout.platforms?.forEach(platform => {
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

        this.platforms.forEach(platform => {
            this.scene.physics.add.collider(this.player, platform);
        });

        this.loadEnemies(layout);
    }

    private loadEnemies(mapLayout: MapLayout): void {
        if (!mapLayout.spawnPoints || !mapLayout.spawnPoints.enemies) return;

        mapLayout.spawnPoints.enemies.forEach(spawnPoint => {
            this.enemyManager.createEnemy(spawnPoint);
        });
    }

    public getEnemyManager(): EnemyManager {
        return this.enemyManager;
    }

    public getPlatforms(): Phaser.GameObjects.GameObject[] {
        return this.platforms;
    }
}