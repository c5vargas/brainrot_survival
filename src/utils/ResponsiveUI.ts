import { Scene } from 'phaser';

export class ResponsiveUI {
    /**
     * Calcula el tamaño de fuente adecuado según el ancho de la pantalla
     * @param scene La escena actual
     * @param baseSize Tamaño base para una resolución de 1280x720
     * @returns Tamaño de fuente ajustado
     */
    static getFontSize(scene: Scene, baseSize: number): string {
        const width = scene.scale.width;
        let fontSize = baseSize;
        
        // Ajustar el tamaño de la fuente según el ancho de la pantalla
        if (width < 1000) {
            fontSize = Math.floor(baseSize * 0.8); // 20% más pequeño para pantallas pequeñas
        } else if (width > 1600) {
            fontSize = Math.floor(baseSize * 1.2); // 20% más grande para pantallas grandes
        }
        
        return `${fontSize}px`;
    }
    
    /**
     * Calcula la posición X para un elemento centrado con un margen seguro
     * @param scene La escena actual
     * @param width Ancho del elemento
     * @param margin Margen seguro (opcional, por defecto 20)
     * @returns Posición X calculada
     */
    static getCenteredX(scene: Scene, width: number, margin: number = 20): number {
        const camera = scene.cameras.main;
        return camera.centerX;
    }
    
    /**
     * Ajusta un texto para que se adapte al ancho disponible
     * @param text Objeto de texto de Phaser
     * @param maxWidth Ancho máximo disponible (por defecto 80% del ancho de la cámara)
     */
    static adjustTextToFit(text: Phaser.GameObjects.Text, maxWidth?: number): void {
        const scene = text.scene;
        const camera = scene.cameras.main;
        const availableWidth = maxWidth || camera.width * 0.8;
        
        // Si el texto es más ancho que el espacio disponible, ajustar
        if (text.width > availableWidth) {
            // Configurar ajuste de palabras
            text.setWordWrapWidth(availableWidth);
            
            // Si aún así es demasiado grande, reducir el tamaño de la fuente
            let currentSize = parseInt(text.style.fontSize.toString());
            while (text.width > availableWidth && currentSize > 12) {
                currentSize -= 2;
                text.setFontSize(currentSize);
            }
        }
    }
    
    /**
     * Crea un contenedor que se ajusta automáticamente a la resolución
     * @param scene La escena actual
     * @returns Contenedor responsivo
     */
    static createResponsiveContainer(scene: Scene): Phaser.GameObjects.Container {
        const container = scene.add.container(0, 0);
        
        // Configurar para que se actualice cuando cambie el tamaño
        scene.scale.on('resize', () => {
            ResponsiveUI.updateContainerPosition(container);
        });
        
        return container;
    }
    
    /**
     * Actualiza la posición de un contenedor según el tamaño actual de la pantalla
     * @param container El contenedor a actualizar
     */
    static updateContainerPosition(container: Phaser.GameObjects.Container): void {
        // Implementar lógica específica de posicionamiento según sea necesario
        const scene = container.scene;
        const camera = scene.cameras.main;
        
        // Ejemplo: mantener el contenedor centrado en la pantalla
        container.setPosition(camera.centerX, camera.centerY);
    }
} 