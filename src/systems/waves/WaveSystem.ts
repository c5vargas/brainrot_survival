import { Scene } from 'phaser';
import { EnemyManager } from '../enemies/EnemyManager';
import { SpawnPoint } from '../../types/MapTypes';
import { Enemy } from '../../entities/base/Enemy';

export interface WaveConfig {
    enemySpawnPoints: SpawnPoint[];
    delay?: number;
}

export interface WaveSystemConfig {
    waves: WaveConfig[];
    timeBetweenWaves: number;
}

export class WaveSystem {
    private scene: Scene;
    private enemyManager: EnemyManager;
    private config: WaveSystemConfig;
    private currentWave: number = 0;
    private enemiesRemaining: number = 0;
    private isWaveActive: boolean = false;
    private waveTimer: Phaser.Time.TimerEvent | null = null;
    private onWaveCompleted: ((waveNumber: number) => void) | null = null;
    private onAllWavesCompleted: (() => void) | null = null;
    private onWaveStarted: ((waveNumber: number, totalEnemies: number) => void) | null = null;
    private onEnemyDefeated: (() => void) | null = null;
    private onEnemySpawned: ((enemy: Enemy) => void) | null = null;

    constructor(scene: Scene, enemyManager: EnemyManager, config: WaveSystemConfig) {
        this.scene = scene;
        this.enemyManager = enemyManager;
        this.config = config;
    }

    public startWaves(): void {
        if (this.currentWave >= this.config.waves.length) {
            if (this.onAllWavesCompleted) {
                this.onAllWavesCompleted();
            }
            return;
        }

        this.startNextWave();
    }

    private startNextWave(): void {
        if (this.currentWave >= this.config.waves.length) {
            if (this.onAllWavesCompleted) {
                this.onAllWavesCompleted();
            }
            return;
        }

        const waveConfig = this.config.waves[this.currentWave];
        this.isWaveActive = true;
        this.enemiesRemaining = waveConfig.enemySpawnPoints.length;

        if (this.onWaveStarted) {
            this.onWaveStarted(this.currentWave + 1, this.enemiesRemaining);
        }

        // Retrasar la aparición de enemigos si se especifica
        const delay = waveConfig.delay || 0;
        
        this.scene.time.delayedCall(delay, () => {
            this.spawnWaveEnemies(waveConfig.enemySpawnPoints);
        });

        this.currentWave++;
    }

    private spawnWaveEnemies(spawnPoints: SpawnPoint[]): void {
        // Crear los nuevos enemigos
        spawnPoints.forEach(spawnPoint => {
            const enemy = this.enemyManager.createEnemy(spawnPoint);
            if (enemy) {
                // Suscribirse al evento de muerte del enemigo
                const originalDie = enemy.die;
                enemy.die = () => {
                    originalDie.call(enemy);
                    this.handleEnemyDefeated();
                };
                
                // Notificar que se ha generado un enemigo
                if (this.onEnemySpawned) {
                    this.onEnemySpawned(enemy);
                }
            }
        });
    }

    private handleEnemyDefeated(): void {
        if (!this.isWaveActive) return;

        this.enemiesRemaining--;
        if (this.onEnemyDefeated) {
            this.onEnemyDefeated();
        }

        if (this.enemiesRemaining <= 0) {
            this.isWaveActive = false;

            if (this.onWaveCompleted) {
                this.onWaveCompleted(this.currentWave);
            }

            // Preparar la siguiente oleada
            if (this.currentWave < this.config.waves.length) {
                this.waveTimer = this.scene.time.delayedCall(
                    this.config.timeBetweenWaves,
                    () => this.startNextWave(),
                    undefined,
                    this
                );
            } else {
                if (this.onAllWavesCompleted) {
                    this.onAllWavesCompleted();
                }
            }
        }
    }

    public getCurrentWave(): number {
        return this.currentWave;
    }

    public getTotalWaves(): number {
        return this.config.waves.length;
    }

    public getEnemiesRemaining(): number {
        return this.enemiesRemaining;
    }

    public setOnWaveStarted(callback: (waveNumber: number, totalEnemies: number) => void): void {
        this.onWaveStarted = callback;
    }

    public setOnWaveCompleted(callback: (waveNumber: number) => void): void {
        this.onWaveCompleted = callback;
    }

    public setOnAllWavesCompleted(callback: () => void): void {
        this.onAllWavesCompleted = callback;
    }

    public setOnEnemyDefeated(callback: () => void): void {
        this.onEnemyDefeated = callback;
    }
    
    public setOnEnemySpawned(callback: (enemy: Enemy) => void): void {
        this.onEnemySpawned = callback;
    }

    public reset(): void {
        this.currentWave = 0;
        this.enemiesRemaining = 0;
        this.isWaveActive = false;
        if (this.waveTimer) {
            this.waveTimer.destroy();
            this.waveTimer = null;
        }
    }
}