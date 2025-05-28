import { Scene } from 'phaser';
import { WaveSystem } from '../systems/waves/WaveSystem';
import { ResponsiveUI } from '../utils/ResponsiveUI';

export class WaveUI {
    private scene: Scene;
    private waveSystem: WaveSystem;
    private waveText: Phaser.GameObjects.Text;
    private enemiesText: Phaser.GameObjects.Text;
    private uiContainer: Phaser.GameObjects.Container;

    constructor(scene: Scene, waveSystem: WaveSystem) {
        this.scene = scene;
        this.waveSystem = waveSystem;
        this.uiContainer = ResponsiveUI.createResponsiveContainer(scene);
        this.createUI();
        this.setupCallbacks();
        this.setupResizeListener();
    }

    private createUI(): void {
        const padding = 30;
        
        // Texto para mostrar la oleada actual
        this.waveText = this.scene.add.text(padding, padding, 'Oleada: 0/0', {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            fontFamily: 'Arial, sans-serif'
        }).setScrollFactor(0).setShadow(2, 2, '#000000', 2, true, true);

        // Texto para mostrar los enemigos restantes
        this.enemiesText = this.scene.add.text(padding, padding + 50, 'Enemigos: 0', {
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            fontFamily: 'Arial, sans-serif'
        }).setScrollFactor(0).setShadow(2, 2, '#000000', 2, true, true);

        this.uiContainer.add([this.waveText, this.enemiesText]);
    }

    private setupCallbacks(): void {
        // Cuando comienza una oleada
        this.waveSystem.setOnWaveStarted((waveNumber, totalEnemies) => {
            this.waveText.setText(`Oleada: ${waveNumber}/${this.waveSystem.getTotalWaves()}`);
            this.enemiesText.setText(`Enemigos: ${totalEnemies}`);
            
            this.showWaveStartMessage(waveNumber);
        });

        // Cuando se derrota a un enemigo
        this.waveSystem.setOnEnemyDefeated(() => {
            this.enemiesText.setText(`Enemigos: ${this.waveSystem.getEnemiesRemaining()}`);
        });

        // Cuando se completa una oleada
        this.waveSystem.setOnWaveCompleted((waveNumber) => {
            this.showWaveCompletedMessage();
        });

        // Cuando se completan todas las oleadas
        this.waveSystem.setOnAllWavesCompleted(() => {
            this.showVictoryMessage();
        });
    }

    private setupResizeListener(): void {
        // Actualizar posición de elementos UI cuando cambia el tamaño de la pantalla
        this.scene.scale.on('resize', this.updateUIPositions, this);
        
        // Asegurar que la UI se posiciona correctamente al inicio
        this.updateUIPositions();
    }

    private updateUIPositions(): void {
        const camera = this.scene.cameras.main;
        const padding = Math.max(30, Math.floor(camera.width * 0.02)); // Padding responsivo
        
        // Actualizar posición de los textos informativos
        this.waveText.setPosition(padding, padding);
        this.enemiesText.setPosition(padding, padding + this.waveText.height + 10);
        
        // Actualizar tamaño de fuente según la resolución
        const waveSize = camera.width >= 1600 ? '36px' : '32px';
        const enemiesSize = camera.width >= 1600 ? '32px' : '28px';
        
        this.waveText.setFontSize(waveSize);
        this.enemiesText.setFontSize(enemiesSize);
    }

    private showWaveStartMessage(waveNumber: number): void {
        const camera = this.scene.cameras.main;
        
        // Mostrar mensaje de inicio de oleada
        const waveStartText = this.scene.add.text(
            camera.centerX,
            camera.centerY - 100,
            `¡Oleada ${waveNumber} Iniciada!`,
            {
                fontSize: '64px',
                color: '#ff0000',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center',
                fontFamily: 'Arial, sans-serif',
                wordWrap: { width: camera.width * 0.8 }
            }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(100)
        .setShadow(4, 4, '#000000', 5, true, true);
        
        // Hacer que el texto desaparezca después de 2 segundos
        this.scene.tweens.add({
            targets: waveStartText,
            alpha: 0,
            duration: 1000,
            delay: 1500,
            onComplete: () => {
                waveStartText.destroy();
            }
        });
    }

    private showWaveCompletedMessage(): void {
        const camera = this.scene.cameras.main;
        
        // Mostrar mensaje de oleada completada
        const waveCompleteText = this.scene.add.text(
            camera.centerX,
            camera.centerY,
            '¡Oleada Completada!',
            {
                fontSize: '64px',
                color: '#00ff00',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center',
                fontFamily: 'Arial, sans-serif',
                wordWrap: { width: camera.width * 0.8 }
            }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(100)
        .setShadow(4, 4, '#000000', 5, true, true);
        
        // Hacer que el texto desaparezca después de 3 segundos
        this.scene.tweens.add({
            targets: waveCompleteText,
            alpha: 0,
            duration: 1000,
            delay: 2000,
            onComplete: () => {
                waveCompleteText.destroy();
            }
        });
    }

    private showVictoryMessage(): void {
        const camera = this.scene.cameras.main;
        
        // Mostrar mensaje de victoria
        const victoryText = this.scene.add.text(
            camera.centerX,
            camera.centerY,
            '¡Has Sobrevivido a Todas las Oleadas!',
            {
                fontSize: '64px',
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center',
                fontFamily: 'Arial, sans-serif',
                wordWrap: { width: camera.width * 0.8 }
            }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(100)
        .setShadow(4, 4, '#000000', 5, true, true);
        
        // Hacer que el texto parpadee
        this.scene.tweens.add({
            targets: victoryText,
            alpha: 0.7,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Opcional: volver al menú principal después de un tiempo
        this.scene.time.delayedCall(10000, () => {
            this.scene.scene.start('MainMenuScene');
        });
    }
} 