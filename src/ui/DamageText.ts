import { Scene } from 'phaser';

export interface DamageTextConfig {
    x: number;
    y: number;
    damage: number;
    color?: string;
    fontSize?: string;
    duration?: number;
    distance?: number;
    isCritical?: boolean;
}

export class DamageText {
    private scene: Scene;
    private text: Phaser.GameObjects.Text;
    private duration: number;

    constructor(scene: Scene, config: DamageTextConfig) {
        this.scene = scene;
        this.duration = config.duration ?? 1000;

        // Determinar el color y tamaño del texto basado en si es crítico
        const color = config.isCritical ? '#ff0000' : (config.color ?? '#ffffff');
        const fontSize = config.isCritical ? '24px' : (config.fontSize ?? '16px');
        
        // Crear el texto
        this.text = this.scene.add.text(
            config.x, 
            config.y, 
            config.damage.toString(), 
            { 
                fontFamily: 'Arial', 
                fontSize: fontSize, 
                color: color,
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5);

        // Añadir efecto de movimiento
        const distance = config.distance ?? 30;
        const randomX = Phaser.Math.Between(-10, 10);
        
        this.scene.tweens.add({
            targets: this.text,
            y: config.y - distance,
            x: config.x + randomX,
            alpha: 0,
            duration: this.duration,
            ease: 'Power2',
            onComplete: () => {
                this.destroy();
            }
        });
    }

    destroy(): void {
        if (this.text) {
            this.text.destroy();
        }
    }
}