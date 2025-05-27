import { Scene } from 'phaser';
import { Enemy } from '../../entities/base/Enemy';
import { Skeleton } from '../../entities/enemies/Skeleton';
import { Player } from '../../entities/Player';
import { SpawnPoint } from '../../types/MapTypes';

export class EnemyManager {
    private scene: Scene;
    private player: Player;
    private enemies: Enemy[] = [];

    constructor(scene: Scene, player: Player) {
        this.scene = scene;
        this.player = player;
    }

    createEnemy(spawnPoint: SpawnPoint): Enemy | null {
        let enemy: Enemy;

        // Factory pattern para crear diferentes tipos de enemigos
        switch (spawnPoint.type) {
            case 'skeleton':
                enemy = new Skeleton({
                    scene: this.scene,
                    x: spawnPoint.x,
                    y: spawnPoint.y,
                    target: this.player,
                    texture: 'skeleton_idle'
                });
                break;
            // Añadir más tipos de enemigos aquí
            default:
                console.warn(`Tipo de enemigo desconocido: ${spawnPoint.type}`);
                return null;
        }

        this.enemies.push(enemy);
        return enemy;
    }

    removeEnemy(enemy: Enemy): void {
        const index = this.enemies.indexOf(enemy);
        if (index !== -1) {
            this.enemies.splice(index, 1);
        }
    }

    setupCollisions(platforms: Phaser.GameObjects.GameObject[]): void {
      this.enemies.forEach(enemy => {
        // Colisiones con plataformas
        platforms.forEach(platform => {
            this.scene.physics.add.collider(enemy, platform);
        });

        // Colisión con el jugador
        this.scene.physics.add.overlap(
            enemy,
            this.player,
            (object1, object2) => {
                const enemyObj = object1 as Enemy;
                const playerObj = object2 as Player;
        
                if (enemyObj instanceof Enemy && playerObj instanceof Player) {
                    this.handleEnemyCollision(enemyObj, playerObj);
                }
            },
            undefined,
            this
        );
      
        
      });
    }

    private handleEnemyCollision(enemy: Enemy, player: Player): void {
        if (!player.getIsInvulnerable()) {
            const damage = enemy.getStats().attack - (player.getStats().defense * 0.5);
            player.takeDamage(Math.max(1, Math.floor(damage)));
        }
    }

    update(): void {
        this.enemies = this.enemies.filter(enemy => enemy.active);
        this.enemies.forEach(enemy => enemy.update());
    }

    getEnemies(): Enemy[] {
        return this.enemies;
    }
}