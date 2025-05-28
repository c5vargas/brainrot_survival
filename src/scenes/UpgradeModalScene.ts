import { Scene } from 'phaser';
import { Upgrade } from '../systems/upgrades/Upgrade';

interface UpgradeModalSceneData {
    upgrades: Upgrade[];
    onUpgradeSelected: (upgrade: Upgrade) => void;
}

export class UpgradeModalScene extends Scene {
    private upgrades: Upgrade[] = [];
    private onUpgradeSelected: ((upgrade: Upgrade) => void) | null = null;
    
    constructor() {
        super({ key: 'UpgradeModalScene' });
    }
    
    init(data: UpgradeModalSceneData): void {
        this.upgrades = data.upgrades;
        this.onUpgradeSelected = data.onUpgradeSelected;
    }
    
    create(): void {
        // Fondo semi-transparente
        const { width, height } = this.cameras.main;
        
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0);
        
        // Título
        const titleText = this.add.text(width / 2, height * 0.2, '¡Elige una mejora!', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        titleText.setOrigin(0.5);
        
        // Crear los paneles de mejoras
        this.createUpgradeOptions();
    }
    
    private createUpgradeOptions(): void {
        const { width, height } = this.cameras.main;
        const startY = height * 0.3;
        const spacing = width * 0.25;
        const centerX = width / 2;
        const startX = centerX - spacing;
        
        // Crear un panel para cada mejora
        this.upgrades.forEach((upgrade, index) => {
            const x = startX + (spacing * index);
            const y = startY + height * 0.15;
            
            this.createUpgradePanel(x, y, upgrade);
        });
    }
    
    private createUpgradePanel(x: number, y: number, upgrade: Upgrade): void {
        const panelWidth = 200;
        const panelHeight = 250;
        
        // Panel de fondo
        const panel = this.add.rectangle(x, y, panelWidth, panelHeight, 0x333333);
        panel.setStrokeStyle(2, 0xffffff);
        panel.setOrigin(0.5);
        panel.setInteractive({ useHandCursor: true });
        
        // Efecto de hover
        panel.on('pointerover', () => {
            panel.setStrokeStyle(3, 0xffff00);
        });
        
        panel.on('pointerout', () => {
            panel.setStrokeStyle(2, 0xffffff);
        });
        
        // Evento de clic
        panel.on('pointerdown', () => {
            if (this.onUpgradeSelected) {
                this.onUpgradeSelected(upgrade);
            }
        });
        
        // Icono de la mejora
        const iconSize = 64;
        const iconY = y - 60;
        
        try {
            // Intentar cargar el icono de la mejora
            const icon = this.add.image(x, iconY, upgrade.getIcon());
            icon.setDisplaySize(iconSize, iconSize);
        } catch (error) {
            // Si no se puede cargar el icono, mostrar un placeholder
            const icon = this.add.rectangle(x, iconY, iconSize, iconSize, 0x666666);
            icon.setStrokeStyle(1, 0xffffff);
        }
        
        // Nombre de la mejora
        const nameText = this.add.text(x, y + 10, upgrade.getName(), {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        });
        nameText.setOrigin(0.5);
        
        // Descripción de la mejora
        const descText = this.add.text(x, y + 60, upgrade.getDescription(), {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#cccccc',
            align: 'center',
            wordWrap: { width: panelWidth - 20 }
        });
        descText.setOrigin(0.5);
    }
} 