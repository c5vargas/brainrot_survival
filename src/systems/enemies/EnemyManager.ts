import { Scene } from 'phaser';
import { Enemy } from '../../entities/base/Enemy';
import { Skeleton } from '../../entities/enemies/Skeleton';
import { Player } from '../../entities/Player';
import { SpawnPoint } from '../../types/MapTypes';

export class EnemyManager {
    private scene: Scene;
    private player: Player;
    private enemies: Enemy[] = [];
    private onEnemyCreated: ((enemy: Enemy) => void) | null = null;

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
                    texture: 'skeleton_idle',
                    canFly: false
                });
                break;
            // Añadir más tipos de enemigos aquí
            default:
                console.warn(`Tipo de enemigo desconocido: ${spawnPoint.type}`);
                return null;
        }

        this.enemies.push(enemy);
        
        // Notificar que se ha creado un enemigo
        if (this.onEnemyCreated) {
            this.onEnemyCreated(enemy);
        }
        
        return enemy;
    }

    removeEnemy(enemy: Enemy): void {
        const index = this.enemies.indexOf(enemy);
        if (index !== -1) {
            this.enemies.splice(index, 1);
        }
    }

    update(): void {
        this.enemies = this.enemies.filter(enemy => enemy.active);
        this.enemies.forEach(enemy => enemy.update());
    }

    getEnemies(): Enemy[] {
        return this.enemies;
    }
    
    setOnEnemyCreated(callback: (enemy: Enemy) => void): void {
        this.onEnemyCreated = callback;
    }

    reset(): void {
        this.enemies.forEach(enemy => enemy.destroy());
        this.enemies = [];
    }
}