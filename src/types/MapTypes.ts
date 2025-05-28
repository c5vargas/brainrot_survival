interface Position {
    x: number;
    y: number;
}

interface MapObject extends Position {
    type: string;
    properties?: Record<string, any>;
}

export interface Platform extends MapObject {
    x: number;
    y: number;
    width: number;
    height: number;
    scale?: number;
}

interface Background extends MapObject {
    width: number;
    height: number;
}

export type EnemyType = 'skeleton' | 'orc' | 'goblin'; // Añade los tipos que necesites

export interface SpawnPoint {
    x: number;
    y: number;
    type: string;
}

export interface SpawnPoints {
    player: SpawnPoint;
    enemies: SpawnPoint[];
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
    platforms: Platform[];
    spawnPoints: SpawnPoints;
    backgrounds?: Background[];
    decorations?: MapObject[];
    buildings?: MapObject[];
    collisionLayers?: CollisionLayer[];
}