import { HealthBar, HealthBarConfig } from '../../ui/HealthBar';
import { EntityStats, EntityConfig, CombatConfig } from './types';

export abstract class Entity extends Phaser.Physics.Arcade.Sprite {
    protected stats!: EntityStats;
    protected isInvulnerable: boolean = false;
    protected isDead: boolean = false;
    protected isAttacking: boolean = false;
    
    protected invulnerabilityTime: number;
    protected attackCooldown: number;
    protected healthBar?: HealthBar;

    constructor(config: EntityConfig, combatConfig?: CombatConfig, healthBarConfig?: Partial<HealthBarConfig>) {
        super(config.scene, config.x, config.y, config.texture, config.frame);
        
        if (!config.scene || !config.scene.sys || !config.scene.add) {
            throw new Error('Scene not properly initialized when creating Entity');
        }

        // Inicializar la entidad solo si la escena está lista
        if (config.scene.sys.settings.active) {
            this.initializeEntity(config);
            this.initializePhysics();
            this.initializeStats();
            this.initializeCombat(combatConfig);
            this.initializeHealthBar(healthBarConfig);
        } else {
            config.scene.events.once('create', () => {
                this.initializeEntity(config);
                this.initializePhysics();
                this.initializeStats();
                this.initializeCombat(combatConfig);
                this.initializeHealthBar(healthBarConfig);
            });
        }
    }

    private initializeEntity(config: EntityConfig): void {
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setDepth(config.depth ?? 1);
        this.setSize(config.size?.width ?? 32, config.size?.height ?? 32);
        this.setScale(config.scale ?? 1);
    }

    private initializePhysics(): void {
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setGravityY(1200);
    }

    protected initializeStats(): void {
        this.stats = {
            maxHealth: 100,
            currentHealth: 100,
            defense: 0,
            attack: 10,
            speed: 200
        };
    }

    private initializeCombat(config?: CombatConfig): void {
        this.invulnerabilityTime = config?.invulnerabilityTime ?? 1000;
        this.attackCooldown = config?.attackCooldown ?? 500;
    }

    protected initializeHealthBar(config?: Partial<HealthBarConfig>): void {
        this.healthBar = new HealthBar(this.scene, {
            ...config,
            x: this.x,
            y: this.y - 20,
            maxValue: this.stats.maxHealth,
            currentValue: this.stats.currentHealth,
            followTarget: this
        });
    }

    public getStats(): EntityStats {
        return this.stats;
    }

    public getIsDead(): boolean {
        return this.isDead;
    }

    protected takeDamage(amount: number): void {
        if (this.isInvulnerable || this.isDead) return;
        
        const actualDamage = Math.max(0, amount - this.stats.defense);
        this.stats.currentHealth -= actualDamage;
        this.setInvulnerable();
        this.onDamageEffect();
        this.showDamageText(actualDamage);
        
        // Actualizar la barra de vida
        if (this.healthBar) {
            this.healthBar.update(this.stats.currentHealth);
        }
        
        if (this.stats.currentHealth <= 0) {
            this.die();
        }
    }

    protected setInvulnerable(): void {
        this.isInvulnerable = true;
        this.scene.time.delayedCall(this.invulnerabilityTime, () => {
            this.isInvulnerable = false;
        });
    }

    protected die(): void {
        this.isDead = true;
        this.setVelocity(0);
        this.setTint(0xff0000);
        this.setAlpha(0.5);
    }

    protected showDamageText(amount: number): void {
        // Este método será implementado por las clases hijas
    }

    public getIsInvulnerable(): boolean {
        return this.isInvulnerable;
    }

    update(): void {
        // Actualizar la barra de vida si existe
        if (this.healthBar) {
            this.healthBar.draw();
        }
    }

    protected abstract onDamageEffect(): void;
    protected abstract attack(): void;
    protected abstract createAnimations(): void;
}