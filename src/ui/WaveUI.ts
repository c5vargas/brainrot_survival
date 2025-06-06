import { Scene } from 'phaser';
import { WaveSystem } from '../systems/waves/WaveSystem';

export class WaveUI {
    private scene: Scene;
    private waveSystem: WaveSystem;
    private waveText: Phaser.GameObjects.Text;
    private uiContainer: Phaser.GameObjects.Container;

    constructor(scene: Scene, waveSystem: WaveSystem) {
        this.scene = scene;
        this.waveSystem = waveSystem;
        this.uiContainer = this.scene.add.container(0, 0);
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


        this.uiContainer.add([this.waveText]);
    }

    private setupCallbacks(): void {
        // Cuando comienza una oleada
        this.waveSystem.setOnWaveStarted((waveNumber, _totalEnemies) => {
            this.waveText.setText(`Oleada: ${waveNumber}/${this.waveSystem.getTotalWaves()}`);
            
            this.showWaveStartMessage(waveNumber);
        });

        // Cuando se completa una oleada - No vamos a registrar este callback aquí
        // para evitar sobrescribir el callback registrado en GameScene
        
        // En lugar de eso, observaremos el evento de enemyDefeated para mostrar el mensaje
        this.waveSystem.setOnEnemyDefeated(() => {
            // Si quedan 0 enemigos, mostrar el mensaje de oleada completada
            if (this.waveSystem.getEnemiesRemaining() === 0) {
                this.showWaveCompletedMessage();
            }
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
        
        // Actualizar tamaño de fuente según la resolución
        const waveSize = camera.width >= 1600 ? '36px' : '32px';
        
        this.waveText.setFontSize(waveSize);
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

    public showWaveCompletedMessage(): void {
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
            '¡Has Sobrevivido!',
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