import { Player } from '../../../entities/Player';
import { Upgrade, UpgradeType } from '../Upgrade';

export class MovementSpeedUpgrade extends Upgrade {
    constructor() {
        super(UpgradeType.MOVEMENT_SPEED, {
            name: 'Velocidad de Movimiento',
            description: 'Aumenta la velocidad de movimiento en un 10%',
            icon: 'movement_speed_icon',
            maxLevel: 5
        });
    }
    
    public apply(player: Player): void {
        // Obtener las estadísticas actuales del jugador
        const stats = player.getStats();
        
        // Aumentar la velocidad en un 10%
        stats.speed = Math.floor(stats.speed * 1.1);
        
        // Aplicar las nuevas estadísticas
        player.updateStats(stats);
    }
} 