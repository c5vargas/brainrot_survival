interface Position {
    x: number;
    y: number;
}

interface MapObject extends Position {
    type: string;
    properties?: Record<string, any>;
}

interface Platform extends MapObject {
    width: number;
    height: number;
}

interface Background extends MapObject {
    width: number;
    height: number;
}

export type EnemyType = 'skeleton' | 'orc' | 'goblin'; // Añade los tipos que necesites

export interface SpawnPoint extends Position {
    type: EnemyType;
}

interface CollisionLayer extends Position {
    width: number;
    height: number;
    type: string;
}

export interface MapLayout {
    id: string;
    name: string;
    width: number;
    height: number;
    isUnlocked: boolean;
    buildings: MapObject[];
    platforms: Platform[];
    backgrounds: Background[];
    decorations: MapObject[];
    spawnPoints: {
        player: Position;
        enemies: SpawnPoint[];
    };
    collisionLayers: CollisionLayer[];
}