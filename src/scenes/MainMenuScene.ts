import { Scene } from 'phaser';

export class MainMenuScene extends Scene {
    protected sideButtons: Phaser.GameObjects.Container[] = [];

    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create(): void {
        this.createBackground();


        // Panel superior con stats del jugador
        this.createTopPanel();

        // Botones laterales izquierdos
        this.createSideButtons();

        // Panel central con selección de nivel
        this.createLevelSelection();

        // Botones laterales derechos
        this.createRightButtons();

        // Botón de jugar
        this.createPlayButton();
    }

    private createBackground(): void {
        const { width, height } = this.cameras.main;
        const background = this.add.image(0, 0, 'main-background');

        background.setOrigin(0);
        background.setScale(width / background.width, height / background.height);
    }

    private createTopPanel(): void {
        // Panel superior
        const panel = this.add.container(0, 0);
        
        // Nivel del jugador (izquierda)
        const levelIcon = this.add.circle(40, 30, 20, 0xffd700);
        const levelText = this.add.text(70, 20, '4/7', {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        // Recursos (derecha)
        const goldIcon = this.add.image(this.cameras.main.width - 200, 30, 'coin').setScale(0.5);
        const goldText = this.add.text(this.cameras.main.width - 170, 20, '524', {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        panel.add([levelIcon, levelText, goldIcon, goldText]);
    }

    private createSideButtons(): void {
        const startY = 150;
        const spacing = 80;
        const buttonRadius = 35;

        this.sideButtons = ['Casa', 'Armas', 'Equipo', 'Tienda', 'Vehículos'].map((text, index) => {
            const y = startY + (index * spacing);
            const container = this.add.container(70, y);

            const bg = this.add.circle(0, 0, buttonRadius, 0x4a4a4a);
            const label = this.add.text(0, 0, text[0], {
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            container.add([bg, label]);
            container.setInteractive(new Phaser.Geom.Circle(0, 0, buttonRadius), Phaser.Geom.Circle.Contains)
                .on('pointerdown', () => this.handleSideButtonClick(text));

            return container;
        });
    }

    private createLevelSelection(): void {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Contenedor central
        const container = this.add.container(centerX, centerY - 50);

        // Título del nivel
        const title = this.add.text(0, -130, '3. Dusty Highway', {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Marco de previsualización
        const previewWidth = 400;
        const previewHeight = 250;
        const preview = this.add.rectangle(0, 0, previewWidth, previewHeight, 0x666666);
        const previewBorder = this.add.rectangle(0, 0, previewWidth + 4, previewHeight + 4, 0xffffff);
        previewBorder.setStrokeStyle(2, 0xffffff);

        // Barra de progreso
        const progressWidth = 300;
        const progressContainer = this.add.container(0, previewHeight/2 + 40);
        
        const progressBg = this.add.rectangle(0, 0, progressWidth, 30, 0x333333);
        const progressBar = this.add.rectangle(-progressWidth/2, 0, progressWidth, 30, 0x00ff00)
            .setOrigin(0, 0.5);

        progressContainer.add([progressBg, progressBar]);
        container.add([previewBorder, preview, title, progressContainer]);
    }

    private createRightButtons(): void {
        const startY = 150;
        const spacing = 80;
        const x = this.cameras.main.width - 70;

        const buttons = ['Diario', 'Mensual', 'Regalo', 'Prestigio'].map((text, index) => {
            const y = startY + (index * spacing);
            const container = this.add.container(x, y);

            const bg = this.add.circle(0, 0, 35, 0x4a4a4a);
            const icon = this.add.text(0, 0, text[0], {
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            container.add([bg, icon]);
            container.setInteractive(new Phaser.Geom.Circle(0, 0, 35), Phaser.Geom.Circle.Contains)
                .on('pointerdown', () => this.handleRightButtonClick(text));

            return container;
        });
    }

    private createPlayButton(): void {
        const centerX = this.cameras.main.width / 2;
        const y = this.cameras.main.height - 80;

        const playButton = this.add.image(centerX, y, 'play-button')
            .setInteractive({ useHandCursor: true })
            .setScale(1)
            .setOrigin(0.5);

        playButton
            .on('pointerover', () => {
                playButton.setScale(0.95);
            })
            .on('pointerout', () => {
                playButton.setScale(1);
                playButton.setTexture('play-button');
            })
            .on('pointerdown', () => {
                playButton.setTexture('play-button-hover');
                this.tweens.add({
                    targets: playButton,
                    scale: 0.95,
                    duration: 100,
                    yoyo: true,
                    onComplete: () => {
                        this.scene.start('GameScene');
                    }
                });
            })
            .on('pointerup', () => {
                playButton.setTexture('play-button');
            });
    
    }

    private handleSideButtonClick(button: string): void {
        console.log(`Clicked side button: ${button}`);
    }

    private handleRightButtonClick(button: string): void {
        console.log(`Clicked right button: ${button}`);
    }
}