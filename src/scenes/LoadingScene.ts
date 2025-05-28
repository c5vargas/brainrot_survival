import { Scene } from 'phaser';

export class LoadingScene extends Scene {
    constructor() {
        super({ key: 'LoadingScene' });    
    }

    preload(): void {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Create progress bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontSize: '20px',
            color: '#ffffff'
        });
        loadingText.setOrigin(0.5);

        // Load game assets
        this.loadCharacters();
        this.loadEnvironment();
        this.loadUI();
        this.loadAudio();

        // Progress bar events
        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            this.scene.start('MainMenuScene');
        });
    }

    private loadCharacters(): void {
        this.load.spritesheet('run_side', 'assets/entities/player/run/Run_Side-Sheet.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('idle_side', 'assets/entities/player/idle/Idle_Side-Sheet.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('pierce_side', 'assets/entities/player/pierce/Pierce_Side-Sheet.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('death_side', 'assets/entities/player/death/Death_Side-Sheet.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('skeleton_idle', 'assets/entities/player/idle/Idle_Side-Sheet.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('skeleton_walk', 'assets/entities/player/run/Run_Side-Sheet.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('skeleton_attack', 'assets/entities/player/pierce/Pierce_Side-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    }

    private loadEnvironment(): void {
        // Cargar fondos
        this.load.image('background-layer-00', 'assets/environment/backgrounds/Background_Layer_00.png');
        this.load.image('background-layer-01', 'assets/environment/backgrounds/Background_Layer_01.png');
        
        // Cargar edificios
        this.load.image('building-wide-door-01', 'assets/environment/buildings/Building_Wide_Door_01.png');
        this.load.image('building-wide-door-02', 'assets/environment/buildings/Building_Wide_Door_02.png');
        this.load.image('building-shop', 'assets/environment/decorations/Environment_Shop.png');
        
        // Cargar plataformas
        this.load.image('ground-01', 'assets/environment/platformer/Platformer_Ground_01.png');
        this.load.image('ground-02', 'assets/environment/platformer/Platformer_Ground_02.png');
        this.load.image('ground-03', 'assets/environment/platformer/Platformer_Ground_03.png');
        this.load.image('ground-06', 'assets/environment/platformer/Platformer_Ground_06.png');
        
        // Cargar decoraciones
        this.load.image('wooden-barrel', 'assets/environment/decorations/Environment_Wooden_Barrel.png');
        this.load.image('wooden-crate', 'assets/environment/decorations/Environment_Wooden_Crate.png');
        this.load.image('quest-board', 'assets/environment/decorations/Environment_Quest_Board.png');
        this.load.image('banner-01', 'assets/environment/decorations/Environment_Banner_01.png');
        this.load.image('tree-01', 'assets/environment/decorations/Environment_Tree_01.png');
        this.load.image('tree-02', 'assets/environment/decorations/Environment_Tree_02.png');
        this.load.image('grass-03', 'assets/environment/decorations/Environment_Grass_03.png');
        this.load.image('stand-spear', 'assets/environment/decorations/Environment_Stand_Spear.png');
        this.load.image('sword-01', 'assets/environment/decorations/Environment_Sword_01.png');
    }

    private loadUI(): void {
        this.load.image('play-button', 'assets/ui/buttons/play-button.png');
        this.load.image('play-button-hover', 'assets/ui/buttons/play-button-hover.png');

        this.load.image('health-bar-bg', 'assets/ui/health-bar-bg.png');
        this.load.image('health-bar-fill', 'assets/ui/health-bar-fill.png');
        this.load.image('health-bar-border', 'assets/ui/health-bar-border.png');
    }

    private loadAudio(): void {
        // Add audio assets loading here
    }
}