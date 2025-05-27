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
    size?: { width: number; height: number };
    scale?: number;
    depth?: number;
}

export interface CombatConfig {
    attackCooldown?: number;
    invulnerabilityTime?: number;
    damage?: number;
}