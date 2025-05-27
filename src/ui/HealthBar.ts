import { Scene } from 'phaser';

export interface HealthBarConfig {
    x: number;
    y: number;
    width?: number;
    height?: number;
    maxValue: number;
    currentValue: number;
    borderColor?: number;
    backgroundColor?: number;
    barColor?: number;
    lowHealthColor?: number;
    lowHealthThreshold?: number;
    padding?: number;
    followTarget?: Phaser.GameObjects.Sprite;
    offsetY?: number;
}

export class HealthBar {
    private scene: Scene;
    private bar: Phaser.GameObjects.Graphics;
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private maxValue: number;
    private currentValue: number;
    private borderColor: number;
    private backgroundColor: number;
    private barColor: number;
    private borderThickness: number;
    private shadowColor: number;
    private highlightColor: number;
    private lowHealthColor: number;
    private lowHealthThreshold: number;
    private padding: number;
    private followTarget?: Phaser.GameObjects.Sprite;
    private offsetY: number;
    private previousValue: number;
    private damageAnimTimer: number;
    private readonly DAMAGE_ANIM_DURATION: number = 500; // duración en milisegundos

    constructor(scene: Scene, config: HealthBarConfig) {
        this.scene = scene;
        this.x = config.x;
        this.y = config.y;
        this.width = config.width ?? 80;
        this.height = config.height ?? 8;
        this.maxValue = config.maxValue;
        this.currentValue = config.currentValue;
        this.previousValue = config.currentValue;
        this.damageAnimTimer = 0;
        this.borderColor = config.borderColor ?? 0x000000;
        this.backgroundColor = config.backgroundColor ?? 0x808080;
        this.barColor = config.barColor ?? 0x00ff00;
        this.borderThickness = 2;
        this.shadowColor = 0x000000;
        this.highlightColor = 0xffffff;
        this.lowHealthColor = config.lowHealthColor ?? 0xff0000;
        this.lowHealthThreshold = config.lowHealthThreshold ?? 0.3;
        this.padding = config.padding ?? 1;
        this.followTarget = config.followTarget;
        this.offsetY = config.offsetY ?? -40;

        this.bar = this.scene.add.graphics();
        this.bar.setDepth(100);
        this.draw();
    }

    draw(): void {
        this.bar.clear();

        // Actualizar posición si hay un objetivo a seguir
        if (this.followTarget && this.followTarget.active) {
            this.x = this.followTarget.x;
            this.y = this.followTarget.y + this.offsetY;
        }

        // Calcular el ancho de la barra de salud actual y previa
        const healthPercentage = Phaser.Math.Clamp(this.currentValue / this.maxValue, 0, 1);
        const previousHealthPercentage = Phaser.Math.Clamp(this.previousValue / this.maxValue, 0, 1);
        const barWidth = (this.width - (this.padding * 2)) * healthPercentage;
        const previousBarWidth = (this.width - (this.padding * 2)) * previousHealthPercentage;

        // Sombra exterior (abajo y derecha)
        this.bar.fillStyle(this.shadowColor, 0.5);
        this.bar.fillRect(
            this.x - this.width / 2 + this.borderThickness, 
            this.y - this.height / 2 + this.borderThickness, 
            this.width, 
            this.height
        );

        // Borde principal
        this.bar.fillStyle(this.borderColor);
        this.bar.fillRect(
            this.x - this.width / 2, 
            this.y - this.height / 2, 
            this.width, 
            this.height
        );

        // Highlight superior e izquierdo
        this.bar.fillStyle(this.highlightColor, 0.3);
        this.bar.fillRect(
            this.x - this.width / 2, 
            this.y - this.height / 2, 
            this.width, 
            this.borderThickness
        );
        this.bar.fillRect(
            this.x - this.width / 2, 
            this.y - this.height / 2, 
            this.borderThickness, 
            this.height
        );

        // Sombra interior (abajo y derecha)
        this.bar.fillStyle(this.shadowColor, 0.3);
        this.bar.fillRect(
            this.x - this.width / 2 + this.width - this.borderThickness, 
            this.y - this.height / 2, 
            this.borderThickness, 
            this.height
        );
        this.bar.fillRect(
            this.x - this.width / 2, 
            this.y - this.height / 2 + this.height - this.borderThickness, 
            this.width, 
            this.borderThickness
        );

        // Fondo de la barra
        this.bar.fillStyle(this.backgroundColor);
        this.bar.fillRect(
            this.x - this.width / 2 + this.padding, 
            this.y - this.height / 2 + this.padding, 
            this.width - (this.padding * 2), 
            this.height - (this.padding * 2)
        );

        // Determinar el color de la barra basado en el porcentaje de salud
        const barColorToUse = healthPercentage <= this.lowHealthThreshold 
            ? this.lowHealthColor 
            : this.barColor;

        // Dibujar la barra de salud actual
        this.bar.fillStyle(barColorToUse);
        this.bar.fillRect(
            this.x - this.width / 2 + this.padding, 
            this.y - this.height / 2 + this.padding, 
            barWidth, 
            this.height - (this.padding * 2)
        );

        if (this.damageAnimTimer > 0) {
            this.damageAnimTimer = Math.max(0, this.damageAnimTimer - this.scene.game.loop.delta);
        }

        // Dibujar la barra de daño (blanca) si hay una animación en curso
        if (this.damageAnimTimer > 0) {
            const alpha = this.damageAnimTimer / this.DAMAGE_ANIM_DURATION;
            this.bar.fillStyle(0xffffff, alpha);
            this.bar.fillRect(
                this.x - this.width / 2 + this.padding + barWidth, 
                this.y - this.height / 2 + this.padding, 
                previousBarWidth - barWidth, 
                this.height - (this.padding * 2)
            );
        }
    }

    update(currentValue: number): void {
        if (currentValue < this.currentValue) {
            this.previousValue = this.currentValue;
            this.damageAnimTimer = this.DAMAGE_ANIM_DURATION;
        }
        this.currentValue = currentValue;

        // Actualizar el temporizador de la animación
        if (this.damageAnimTimer > 0) {
            this.damageAnimTimer = Math.max(0, this.damageAnimTimer - this.scene.game.loop.delta);
        }

        this.draw();
    }

    destroy(): void {
        this.bar.destroy();
    }
}