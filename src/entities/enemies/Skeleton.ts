import { Enemy, EnemyConfig } from '../base/Enemy';
import { CombatConfig } from '../base/types';

export class Skeleton extends Enemy {
    constructor(config: EnemyConfig) {
        const combatConfig: CombatConfig = {
            attackCooldown: 1500,
            damage: 15
        };

        super({
            ...config,
            texture: 'skeleton_idle',
            scale: 2,
            detectionRange: 250,
            attackRange: 45,
            canFly: false
        }, combatConfig);

        this.createAnimations();
    }

    protected createAnimations(): void {
        this.scene.anims.create({
            key: 'skeleton_walk',
            frames: this.scene.anims.generateFrameNumbers('skeleton_walk', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'skeleton_attack',
            frames: this.scene.anims.generateFrameNumbers('skeleton_attack', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'skeleton_idle',
            frames: this.scene.anims.generateFrameNumbers('skeleton_idle', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }

    protected attack(): void {
        this.anims.play('skeleton_attack', true);
        super.attack();
    }

    protected updateAnimations(): void {
        if(this.isAttacking) return;
        
        if (this.body?.velocity.x !== 0 || this.body?.velocity.y !== 0) {
            this.anims.play('skeleton_walk', true);
        } else {
            this.anims.play('skeleton_idle', true);
        }
    }
}