import { Player } from '../../entities/Player';

export enum UpgradeType {
    ATTACK_SPEED = 'attack_speed',
    MOVEMENT_SPEED = 'movement_speed',
    DAMAGE = 'damage',
    CRITICAL_CHANCE = 'critical_chance'
}

export interface UpgradeInfo {
    name: string;
    description: string;
    icon: string;
    maxLevel: number;
}

export abstract class Upgrade {
    protected info: UpgradeInfo;
    protected type: UpgradeType;
    
    constructor(type: UpgradeType, info: UpgradeInfo) {
        this.type = type;
        this.info = info;
    }
    
    public abstract apply(player: Player): void;
    
    public getInfo(): UpgradeInfo {
        return this.info;
    }
    
    public getType(): UpgradeType {
        return this.type;
    }
    
    public getName(): string {
        return this.info.name;
    }
    
    public getDescription(): string {
        return this.info.description;
    }
    
    public getIcon(): string {
        return this.info.icon;
    }
    
    public getMaxLevel(): number {
        return this.info.maxLevel;
    }
} 