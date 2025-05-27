export interface EntityStats {
    maxHealth: number;
    currentHealth: number;
    defense: number;
    attack: number;
    speed: number;
}

export interface EntityConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
    frame?: string | number;
    depth?: number;
    scale?: number;
    size?: {
        width: number;
        height: number;
    };
    canFly?: boolean;
}

export interface CombatConfig {
    attackCooldown?: number;
    invulnerabilityTime?: number;
    damage?: number;
}