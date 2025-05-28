import { Scene } from 'phaser';
import { Player } from '../../entities/Player';
import { Upgrade, UpgradeType } from './Upgrade';
import { AttackSpeedUpgrade } from './upgrades/AttackSpeedUpgrade';
import { MovementSpeedUpgrade } from './upgrades/MovementSpeedUpgrade';
import { DamageUpgrade } from './upgrades/DamageUpgrade';

export class UpgradeSystem {
    private scene: Scene;
    private player: Player;
    private availableUpgrades: Upgrade[];
    private appliedUpgrades: Map<UpgradeType, number>;
    private isModalOpen: boolean = false;

    constructor(scene: Scene, player: Player) {
        this.scene = scene;
        this.player = player;
        this.availableUpgrades = this.initializeUpgrades();
        this.appliedUpgrades = new Map<UpgradeType, number>();
    }

    private initializeUpgrades(): Upgrade[] {
        return [
            new AttackSpeedUpgrade(),
            new MovementSpeedUpgrade(),
            new DamageUpgrade()
        ];
    }

    public showUpgradeOptions(): void {
        if (this.isModalOpen) return;
                
        // Seleccionar 3 mejoras aleatorias de las disponibles
        const upgrades = this.getRandomUpgrades(3);
        
        // Mostrar el modal con las opciones
        this.openUpgradeModal(upgrades);
    }

    private getRandomUpgrades(count: number): Upgrade[] {
        // Crear una copia del array de mejoras disponibles
        const availableUpgradesCopy = [...this.availableUpgrades];
        
        // Mezclar el array para obtener una selección aleatoria
        this.shuffleArray(availableUpgradesCopy);
        
        // Tomar las primeras 'count' mejoras
        return availableUpgradesCopy.slice(0, Math.min(count, availableUpgradesCopy.length));
    }

    private shuffleArray(array: any[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    private openUpgradeModal(upgrades: Upgrade[]): void {
        this.isModalOpen = true;
        
        // Pausar el juego mientras se muestra el modal
        this.scene.scene.pause();
        
        // Crear una nueva escena superpuesta para el modal
        this.scene.scene.launch('UpgradeModalScene', {
            upgrades,
            onUpgradeSelected: (upgrade: Upgrade) => this.applyUpgrade(upgrade)
        });
    }

    public applyUpgrade(upgrade: Upgrade): void {
        // Aplicar la mejora al jugador
        upgrade.apply(this.player);
        
        // Registrar la mejora aplicada
        const currentLevel = this.appliedUpgrades.get(upgrade.getType()) || 0;
        this.appliedUpgrades.set(upgrade.getType(), currentLevel + 1);
        
        // Cerrar el modal y reanudar el juego
        this.closeModal();
    }

    private closeModal(): void {
        this.isModalOpen = false;
        this.scene.scene.resume();
        this.scene.scene.stop('UpgradeModalScene');
    }

    public getAppliedUpgradeLevel(type: UpgradeType): number {
        return this.appliedUpgrades.get(type) || 0;
    }
} 