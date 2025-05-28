import { Scene } from 'phaser';
import { Player } from '../entities/Player';
import { MapLoader } from '../systems/map/MapLoader';
import { MapLayout } from '../types/MapTypes';
import { medievalMap1Layout } from '../config/maps/medieval_map_1';
import { WaveSystem, WaveSystemConfig } from '../systems/waves/WaveSystem';
import { CollisionSystem } from '../systems/CollisionSystem';

export class GameScene extends Scene {
    private player!: Player;
    private currentMap: MapLayout | null;
    private mapLoader!: MapLoader;
    private waveSystem!: WaveSystem;
    private collisionSystem!: CollisionSystem;
    private waveText!: Phaser.GameObjects.Text;
    private enemiesText!: Phaser.GameObjects.Text;

    public getMapLoader(): MapLoader {
        return this.mapLoader;
    }

    constructor() {
        super({ key: 'GameScene' });
        this.currentMap = null;
    }

    init(data: { map?: MapLayout }): void {
        this.currentMap = data.map || medievalMap1Layout;
        if (!this.currentMap) {
            console.error('Mapa no encontrado:', data.map);
            this.scene.start('MapSelectionScene');
            return;
        }
    }

    create(): void {
        // Verificamos que el teclado esté disponible
        if (!this.input.keyboard) {
            console.error('Keyboard not available');
            return;
        }

        if (this.currentMap && this.currentMap.spawnPoints) {
            const spawnPoint = this.currentMap.spawnPoints.player;
            this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        } else {
            // Punto de spawn por defecto si no está definido
            this.player = new Player(this, this.cameras.main.centerX, this.cameras.main.centerY);
        }
        
        // Inicializamos el MapLoader después de crear el jugador
        this.mapLoader = new MapLoader(this, this.player);

        // Configuramos la cámara para que siga al jugador
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setZoom(1.1);

        if (this.currentMap) {
            this.mapLoader.loadMap(this.currentMap);
        }

        // Inicializar el sistema de colisiones
        this.collisionSystem = new CollisionSystem(this, this.player);
        this.collisionSystem.setPlatforms(this.mapLoader.getPlatforms());
        
        // Configurar el EnemyManager para notificar cuando se crea un enemigo
        this.mapLoader.getEnemyManager().setOnEnemyCreated(enemy => {
            this.collisionSystem.addEnemy(enemy);
        });

        // Inicializar el sistema de oleadas
        this.setupWaveSystem();
    }

    private setupWaveSystem(): void {
        // Configuración de ejemplo para las oleadas
        const waveSystemConfig: WaveSystemConfig = {
            waves: [
                // Oleada 1: 3 esqueletos básicos
                {
                    enemySpawnPoints: [
                        { x: 300, y: 550, type: 'skeleton' },
                        { x: 500, y: 550, type: 'skeleton' },
                        { x: 700, y: 550, type: 'skeleton' }
                    ]
                },
                // Oleada 2: 5 esqueletos
                {
                    enemySpawnPoints: [
                        { x: 300, y: 550, type: 'skeleton' },
                        { x: 400, y: 550, type: 'skeleton' },
                        { x: 500, y: 550, type: 'skeleton' },
                        { x: 600, y: 550, type: 'skeleton' },
                        { x: 700, y: 550, type: 'skeleton' }
                    ],
                    delay: 1000 // Retraso de 1 segundo para la aparición
                },
                // Oleada 3: 7 esqueletos
                {
                    enemySpawnPoints: [
                        { x: 200, y: 550, type: 'skeleton' },
                        { x: 300, y: 550, type: 'skeleton' },
                        { x: 400, y: 550, type: 'skeleton' },
                        { x: 500, y: 550, type: 'skeleton' },
                        { x: 600, y: 550, type: 'skeleton' },
                        { x: 700, y: 550, type: 'skeleton' },
                        { x: 800, y: 550, type: 'skeleton' }
                    ],
                    delay: 1500 // Retraso de 1.5 segundos para la aparición
                }
            ],
            timeBetweenWaves: 5000 // 5 segundos entre oleadas
        };

        // Crear el sistema de oleadas
        this.waveSystem = new WaveSystem(
            this,
            this.mapLoader.getEnemyManager(),
            waveSystemConfig
        );
        
        // Configurar el WaveSystem para notificar cuando se genera un enemigo
        this.waveSystem.setOnEnemySpawned(enemy => {
            this.collisionSystem.addEnemy(enemy);
        });

        // Crear textos informativos para la UI
        this.createWaveUI();

        // Configurar callbacks para eventos del sistema de oleadas
        this.setupWaveCallbacks();

        // Iniciar las oleadas después de un retraso inicial
        this.time.delayedCall(2000, () => {
            this.waveSystem.startWaves();
        });
    }

    private createWaveUI(): void {
        // Texto para mostrar la oleada actual
        this.waveText = this.add.text(16, 16, 'Oleada: 0/0', {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);

        // Texto para mostrar los enemigos restantes
        this.enemiesText = this.add.text(16, 56, 'Enemigos: 0', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);
    }

    private setupWaveCallbacks(): void {
        // Cuando comienza una oleada
        this.waveSystem.setOnWaveStarted((waveNumber, totalEnemies) => {
            this.waveText.setText(`Oleada: ${waveNumber}/${this.waveSystem.getTotalWaves()}`);
            this.enemiesText.setText(`Enemigos: ${totalEnemies}`);
            
            // Mostrar mensaje de inicio de oleada
            const waveStartText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 50,
                `¡Oleada ${waveNumber} Iniciada!`,
                {
                    fontSize: '48px',
                    color: '#ff0000',
                    stroke: '#000000',
                    strokeThickness: 6
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(100);
            
            // Hacer que el texto desaparezca después de 2 segundos
            this.tweens.add({
                targets: waveStartText,
                alpha: 0,
                duration: 1000,
                delay: 1000,
                onComplete: () => {
                    waveStartText.destroy();
                }
            });
        });

        // Cuando se derrota a un enemigo
        this.waveSystem.setOnEnemyDefeated(() => {
            this.enemiesText.setText(`Enemigos: ${this.waveSystem.getEnemiesRemaining()}`);
        });

        // Cuando se completa una oleada
        this.waveSystem.setOnWaveCompleted((waveNumber) => {
            // Mostrar mensaje de oleada completada
            const waveCompleteText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                '¡Oleada Completada!',
                {
                    fontSize: '48px',
                    color: '#00ff00',
                    stroke: '#000000',
                    strokeThickness: 6
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(100);
            
            // Hacer que el texto desaparezca después de 3 segundos
            this.tweens.add({
                targets: waveCompleteText,
                alpha: 0,
                duration: 1000,
                delay: 2000,
                onComplete: () => {
                    waveCompleteText.destroy();
                }
            });
        });

        // Cuando se completan todas las oleadas
        this.waveSystem.setOnAllWavesCompleted(() => {
            // Mostrar mensaje de victoria
            const victoryText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                '¡Has Sobrevivido a Todas las Oleadas!',
                {
                    fontSize: '48px',
                    color: '#ffff00',
                    stroke: '#000000',
                    strokeThickness: 6
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(100);
            
            // Hacer que el texto parpadee
            this.tweens.add({
                targets: victoryText,
                alpha: 0.5,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
            
            // Opcional: volver al menú principal después de un tiempo
            this.time.delayedCall(10000, () => {
                this.scene.start('MainMenuScene');
            });
        });
    }

    update(): void {
        if (!this.player) return;
        this.player.update();
        this.mapLoader.update();
    }
}