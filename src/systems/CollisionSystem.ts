import { Scene } from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/base/Enemy';

export class CollisionSystem {
    private scene: Scene;
    private player: Player;
    private platforms: Phaser.GameObjects.GameObject[] = [];
    private enemies: Enemy[] = [];

    constructor(scene: Scene, player: Player) {
        this.scene = scene;
        this.player = player;
    }

    public setPlatforms(platforms: Phaser.GameObjects.GameObject[]): void {
        this.platforms = platforms;
        
        // Configurar colisiones del jugador con las plataformas
        this.platforms.forEach(platform => {
            this.scene.physics.add.collider(this.player, platform);
        });
    }

    public addEnemy(enemy: Enemy): void {
        if (!enemy || this.enemies.includes(enemy)) return;
        
        this.enemies.push(enemy);
        
        // Configurar colisiones del enemigo con las plataformas
        this.platforms.forEach(platform => {
            this.scene.physics.add.collider(enemy, platform);
        });
        
        // Configurar overlap entre el enemigo y el jugador para el sistema de combate
        this.scene.physics.add.overlap(
            enemy,
            this.player,
            (obj1, obj2) => {
                if (obj1 instanceof Enemy && obj2 instanceof Player) {
                    this.handleEnemyPlayerOverlap(obj1, obj2);
                } else if (obj1 instanceof Player && obj2 instanceof Enemy) {
                    this.handleEnemyPlayerOverlap(obj2, obj1);
                }
            },
            undefined,
            this
        );
    }

    public removeEnemy(enemy: Enemy): void {
        const index = this.enemies.indexOf(enemy);
        if (index !== -1) {
            this.enemies.splice(index, 1);
        }
    }

    private handleEnemyPlayerOverlap(enemy: Enemy, player: Player): void {
        if (!player.getIsInvulnerable()) {
            const damage = enemy.getStats().attack - (player.getStats().defense * 0.5);
            player.takeDamage(Math.max(1, Math.floor(damage)));
        }
    }

    public reset(): void {
        this.enemies = [];
    }
} 