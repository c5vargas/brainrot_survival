import { Entity } from './Entity';
import { Player } from '../Player';
import { EntityConfig, CombatConfig } from './types';
import { MapLoader } from '../../systems/map/MapLoader';
import { EnemyManager } from '../../systems/enemies/EnemyManager';
import { DamageText } from '../../ui/DamageText';

export interface EnemyConfig extends EntityConfig {
    target: Player;
    detectionRange?: number;
    attackRange?: number;
}

export abstract class Enemy extends Entity {
    protected target: Player;
    protected detectionRange: number;
    protected attackRange: number;

    constructor(config: EnemyConfig, combatConfig?: CombatConfig) {
        super(config, combatConfig, { width: 50, height: 6 });
        this.target = config.target;
        this.detectionRange = config.detectionRange ?? 200;
        this.attackRange = config.attackRange ?? 50;
    }

    protected moveTowardsTarget(): void {
        if (!this.target || !this.body) return;

        const distance = Phaser.Math.Distance.Between(
            this.x, this.y,
            this.target.x, this.target.y
        );
    
        if (distance <= this.attackRange) {
            this.setVelocity(0);
        } else if (distance <= this.detectionRange) {
            this.moveToPosition(this.target.x, this.target.y);
        } else {
            this.setVelocity(0);
        }
    }

    private moveToPosition(x: number, y: number): void {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);
        this.setVelocityX(Math.cos(angle) * this.stats.speed);
        this.setVelocityY(Math.sin(angle) * this.stats.speed);
        this.setFlipX(x < this.x);
    }

    protected attack(): void {
        if (this.isAttacking) return;

        this.isAttacking = true;
        this.anims.play('attack', true);
    
        this.scene.time.delayedCall(this.attackCooldown, () => {
            if(this.active) {
                this.isAttacking = false;
                this.setVelocityX(0);
            }
        });
    }

    protected checkAttack(): void {
        if (!this.target || !this.body || this.target.getIsDead()) return;

        const distance = Phaser.Math.Distance.Between(
            this.x, this.y,
            this.target.x, this.target.y
        );

        if (distance <= this.attackRange && !this.isAttacking) {
            this.attack();
        }
    }

    protected onDamageEffect(): void {
        this.setTint(0xff0000);
        this.scene.time.delayedCall(this.invulnerabilityTime, () => {
            this.clearTint();
        });
    }

    protected showDamageText(amount: number): void {
        new DamageText(this.scene, {
            x: this.x,
            y: this.y - 30,
            damage: amount,
            color: '#ffffff',
            isCritical: amount > 20 // Consideramos crítico si el daño es mayor a 20
        });
    }

    public takeDamage(amount: number): void {        
        const knockbackForce = 150;
        const direction = this.x > this.target.x ? 1 : -1;
        this.setVelocityX(direction * knockbackForce);
        
        super.takeDamage(amount);
    }

    protected die(): void {
        if (this.healthBar) {
            this.healthBar.destroy();
        }

        const gameScene = this.scene as Phaser.Scene;
        const mapLoader: MapLoader = (gameScene as any).getMapLoader?.();
        const enemyManager: EnemyManager = mapLoader?.getEnemyManager?.();
          
        if (enemyManager) {
            enemyManager.removeEnemy(this);
        }
        
        this.destroy();
    }

    update(): void {
        this.moveTowardsTarget();
        this.checkAttack();
        this.updateAnimations();
        super.update();
    }

    protected abstract updateAnimations(): void;
}