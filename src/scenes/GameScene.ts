import { Scene } from 'phaser';
import { Player } from '../entities/Player';
import { MapLoader } from '../systems/map/MapLoader';
import { MapLayout } from '../types/MapTypes';
import { medievalMap1Layout } from '../config/maps/medieval_map_1';
import { WaveSystem, WaveSystemConfig } from '../systems/waves/WaveSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { WaveUI } from '../ui/WaveUI';
import { UpgradeSystem } from '../systems/upgrades/UpgradeSystem';

export class GameScene extends Scene {
    private player!: Player;
    private currentMap: MapLayout | null;
    private mapLoader!: MapLoader;
    private waveSystem!: WaveSystem;
    private collisionSystem!: CollisionSystem;
    private upgradeSystem!: UpgradeSystem;

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
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setZoom(1.0);
        this.cameras.main.centerOn(this.player.x, this.player.y);
        
        // Asegurar que los límites de la cámara estén correctamente configurados
        if (this.currentMap && this.currentMap.width && this.currentMap.height) {
            this.cameras.main.setBounds(0, 0, this.currentMap.width, this.currentMap.height);
        }

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

        // Inicializar el sistema de mejoras
        this.upgradeSystem = new UpgradeSystem(this, this.player);

        // Inicializar el sistema de oleadas
        this.setupWaveSystem();

        // Botón para probar el sistema de mejoras
        this.createTestButton();        
    }

    private createTestButton(): void {
        // Crear un botón para probar el sistema de mejoras
        const button = this.add.rectangle(100, 200, 150, 50, 0x4444ff);
        button.setScrollFactor(0);
        button.setInteractive({ useHandCursor: true });
        
        const buttonText = this.add.text(100, 200, 'Mostrar Mejoras', {
            fontSize: '16px',
            color: '#ffffff'
        });
        buttonText.setScrollFactor(0);
        buttonText.setOrigin(0.5);
        
        button.on('pointerdown', () => {
            this.upgradeSystem.showUpgradeOptions();
        });
        
        // Botón para matar a todos los enemigos y forzar fin de oleada
        const killButton = this.add.rectangle(100, 260, 150, 50, 0xff4444);
        killButton.setScrollFactor(0);
        killButton.setInteractive({ useHandCursor: true });
        
        const killButtonText = this.add.text(100, 260, 'Matar Enemigos', {
            fontSize: '16px',
            color: '#ffffff'
        });
        killButtonText.setScrollFactor(0);
        killButtonText.setOrigin(0.5);
        
        killButton.on('pointerdown', () => {
            const enemies = this.mapLoader.getEnemyManager().getEnemies();
            enemies.forEach(enemy => {
                enemy.takeDamage(1000);
            });
        });
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

        this.waveSystem = new WaveSystem(
            this,
            this.mapLoader.getEnemyManager(),
            waveSystemConfig
        );
        
        this.waveSystem.setOnEnemySpawned((enemy) => {
            this.collisionSystem.addEnemy(enemy);
        });

        this.waveSystem.setOnWaveCompleted((_waveNumber) => {
            this.time.delayedCall(1000, () => {
                this.upgradeSystem.showUpgradeOptions();
            });
        });

        new WaveUI(this, this.waveSystem);

        this.time.delayedCall(2000, () => {
            this.waveSystem.startWaves();
        });
    }

    update(): void {
        if (!this.player) return;
        this.player.update();
        this.mapLoader.update();
    }
}