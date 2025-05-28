import { Player } from '../../../entities/Player';
import { Upgrade, UpgradeType } from '../Upgrade';

export class AttackSpeedUpgrade extends Upgrade {
    constructor() {
        super(UpgradeType.ATTACK_SPEED, {
            name: 'Velocidad de Ataque',
            description: 'Aumenta la velocidad de ataque en un 15%',
            icon: 'attack_speed_icon',
            maxLevel: 5
        });
    }
    
    public apply(player: Player): void {
        // Obtener el cooldown actual de ataque
        const currentCooldown = player.getAttackCooldown();
        
        // Reducir el cooldown en un 15% (aumentar velocidad de ataque)
        const newCooldown = currentCooldown * 0.85;
        
        // Aplicar el nuevo cooldown
        player.setAttackCooldown(newCooldown);
    }
} 