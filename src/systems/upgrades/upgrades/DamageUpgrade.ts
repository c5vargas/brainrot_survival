import { Player } from '../../../entities/Player';
import { Upgrade, UpgradeType } from '../Upgrade';

export class DamageUpgrade extends Upgrade {
    constructor() {
        super(UpgradeType.DAMAGE, {
            name: 'Daño Aumentado',
            description: 'Aumenta el daño de ataque en un 15%',
            icon: 'damage_icon',
            maxLevel: 5
        });
    }
    
    public apply(player: Player): void {
        // Obtener las estadísticas actuales del jugador
        const stats = player.getStats();
        
        // Aumentar el daño en un 15%
        stats.attack = Math.floor(stats.attack * 1.15);
        
        // Aplicar las nuevas estadísticas
        player.updateStats(stats);
    }
} 