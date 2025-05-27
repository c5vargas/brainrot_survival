import { Scene } from 'phaser';
import { Entity } from './base/Entity';
import { EntityConfig, CombatConfig, EntityStats } from './base/types';
import { Enemy } from './base/Enemy';
import { DamageText } from '../ui/DamageText';
import { HealthBarConfig } from '../ui/HealthBar';

export interface PlayerStats extends EntityStats {
    agility: number;
    level: number;
    experience: number;
    experienceToNextLevel: number;
}

export interface PlayerConfig extends EntityConfig {
    baseJumpForce?: number;
    dashSpeed?: number;
}

export class Player extends Entity {
    protected declare stats: PlayerStats;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private attackKey: Phaser.Input.Keyboard.Key;
    
    // Movement properties
    private canDoubleJump: boolean = false;
    private baseJumpForce: number;
    private isDashing: boolean = false;
    private dashSpeed: number;

    constructor(scene: Scene, x: number, y: number) {
        const config: PlayerConfig = {
            scene,
            x,
            y,
            texture: 'idle_side',
            scale: 2.5,
            size: { width: 32, height: 32 },
            baseJumpForce: -400,
            dashSpeed: 180
        };

        const combatConfig: CombatConfig = {
            invulnerabilityTime: 500,
            attackCooldown: 500
        };

        const healthBarConfig: Partial<HealthBarConfig> = {
            width: 60,
            height: 12,
        }

        super(config, combatConfig, healthBarConfig);
        
        this.baseJumpForce = config.baseJumpForce ?? -400;
        this.dashSpeed = config.dashSpeed ?? 180;
        
        this.initializeControls();
        this.initializePlayerStats();
        this.createAnimations();
    }

    private initializeControls(): void {
        if (!this.scene.input.keyboard) {
            console.error('Keyboard not available');
            return;
        }

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.attackKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    private initializePlayerStats(): void {
        const baseStats = this.getStats();
        this.stats = {
            ...baseStats,
            agility: 5,
            level: 1,
            attack: 50,
            experience: 0,
            experienceToNextLevel: 100
        } as PlayerStats;
    }

    protected createAnimations(): void {
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNumbers('run_side', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'jump',
            frames: [{ key: 'run_side', frame: 1 }],
            frameRate: 1
        });

        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('idle_side', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'attack',
            frames: this.scene.anims.generateFrameNumbers('pierce_side', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'death',
            frames: this.scene.anims.generateFrameNumbers('death_side', { start: 0, end: 7 }),
            frameRate: 16,
            repeat: 0
        });
    }

    protected showDamageText(amount: number): void {
        new DamageText(this.scene, {
            x: this.x,
            y: this.y - 30,
            damage: amount,
            color: '#ff8080', // Color diferente para el jugador
            isCritical: amount > 15 // Umbral diferente para el jugador
        });
    }

    public takeDamage(amount: number): void {
        if(this.isDead) return;

        super.takeDamage(amount);
        this.scene.cameras.main.shake(100, 0.002);
    }

    protected attack(): void {
        if (this.isAttacking) return;

        this.isAttacking = true;
        this.anims.play('attack', true);
    
        // Detectar enemigos en rango y aplicar daño
        this.detectAndDamageEnemies();
    
        this.handleDashAttack();
    
        this.scene.time.delayedCall(this.attackCooldown, () => {
            this.isAttacking = false;
            this.isDashing = false;
            this.setVelocityX(0);
        });
    }

    // Método para detectar y dañar enemigos en el rango de ataque
    private detectAndDamageEnemies(): void {
        // Obtener referencia al EnemyManager desde la escena
        const gameScene = this.scene as Phaser.Scene;
        const enemyManager = (gameScene as any).mapLoader?.enemyManager;
        
        if (!enemyManager) return;
        
        const enemies = enemyManager.getEnemies();
        const attackRange = this.width * 2; // Doble del tamaño del jugador
        const facingDirection = this.flipX ? -1 : 1;
        
        enemies.forEach((enemy: Enemy) => {
            // Calcular si el enemigo está en la dirección correcta
            const enemyDirection = enemy.x - this.x;
            const isFacingEnemy = (facingDirection === 1 && enemyDirection > 0) || 
                                 (facingDirection === -1 && enemyDirection < 0);
            
            if (!isFacingEnemy) return;
            
            // Calcular distancia
            const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            
            // Si está en rango, aplicar daño
            if (distance <= attackRange) {
                const damage = this.stats.attack;
                enemy.takeDamage(damage);
            }
        });
    }

    private handleDashAttack(): void {
        this.isDashing = this.cursors.down.isDown;
        
        if (this.isDashing) {
            const direction = this.flipX ? -1 : 1;
            this.setVelocityX(direction * this.dashSpeed);
        }
    }

    private handleJump(): void {
        const onGround = this.body?.blocked.down;
        const jumpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);

        if (onGround) {
            this.canDoubleJump = true;
        }

        if (jumpJustPressed) {
            if (onGround) {
                this.performJump();
                this.canDoubleJump = true;
            } else if (this.canDoubleJump) {
                this.performJump();
                this.canDoubleJump = false;
            }
        }
    }

    private performJump(): void {
        this.setVelocityY(this.baseJumpForce);
        this.anims.play('jump', true);
    }

    private handleMovement(onGround: boolean): void {
        if (this.cursors.left.isDown) {
            this.moveLeft(onGround);
        } else if (this.cursors.right.isDown) {
            this.moveRight(onGround);
        } else {
            this.stopMovement(onGround);
        }

        if (!onGround) {
            this.anims.play('jump', true);
        }
    }

    private moveLeft(onGround: boolean): void {
        this.setVelocityX(-this.stats.speed);
        this.setFlipX(true);
        if (onGround) this.anims.play('run', true);
    }

    private moveRight(onGround: boolean): void {
        this.setVelocityX(this.stats.speed);
        this.setFlipX(false);
        if (onGround) this.anims.play('run', true);
    }

    private stopMovement(onGround: boolean): void {
        this.setVelocityX(0);
        if (onGround) this.anims.play('idle', true);
    }

    update(): void {
        if (!this.cursors || !this.body || this.stats.currentHealth <= 0) return;

        super.update()

        const onGround = this.body.blocked.down;

        this.handleJump();

        if (this.attackKey.isDown && !this.isAttacking) {
            this.attack();
            return;
        }

        if (this.isAttacking) {
            if (!this.isDashing) {
                this.setVelocityX(0);
            }
            return;
        }

        this.handleMovement(onGround);
    }

    protected onDamageEffect(): void {
        this.setTint(0xff0000);
        this.scene.time.delayedCall(this.invulnerabilityTime, () => {
            this.clearTint();
        });
    }

    protected die(): void {
        
        if (this.healthBar) {
            this.healthBar.destroy();
        }
        
        if(this.isDead) return;
        this.anims.play('death', true);
        super.die();
        
        // Implementar lógica de muerte (reiniciar nivel, mostrar game over, etc.)
    }

    public gainExperience(amount: number): void {
        this.stats.experience += amount;
        if (this.stats.experience >= this.stats.experienceToNextLevel) {
            this.levelUp();
        }
    }

    private levelUp(): void {
        this.stats.level++;
        this.stats.maxHealth += 10;
        this.stats.currentHealth = this.stats.maxHealth;
        this.stats.defense += 2;
        this.stats.attack += 3;
        this.stats.agility += 1;
        this.stats.experience -= this.stats.experienceToNextLevel;
        this.stats.experienceToNextLevel *= 1.5;
    }

    public getIsInvulnerable(): boolean {
        return this.isInvulnerable;
    }
}