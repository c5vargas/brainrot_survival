
export class ProgressionSystem {
    private static readonly STORAGE_KEY = 'game_progress';

    static saveMapProgress(mapId: string, score: number): void {
        const progress = this.getProgress();
        progress[mapId] = Math.max(progress[mapId] || 0, score);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));

        // Desbloquear mapas según las condiciones
        // this.updateMapUnlocks(progress);
    }

    static getProgress(): Record<string, number> {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    }

    // private static updateMapUnlocks(progress: Record<string, number>): void {
    //     GAME_MAPS.forEach(map => {
    //         if (map.unlockCondition.previousMapId) {
    //             const requiredScore = map.unlockCondition.requiredScore || 0;
    //             const previousMapScore = progress[map.unlockCondition.previousMapId] || 0;
    //             map.isUnlocked = previousMapScore >= requiredScore;
    //         }
    //     });
    // }
}