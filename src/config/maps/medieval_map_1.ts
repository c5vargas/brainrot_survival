import { MapLayout } from "../../types/MapTypes";

export const medievalMap1Layout: MapLayout = {
    id: 'medieval_map_1',
    name: 'Reino Medieval',
    width: 3200,  // Ancho total del mapa
    height: 1600, // Alto total del mapa
    isUnlocked: true,
    backgrounds: [
        {
            type: 'background-layer-00',
            x: 0,
            y: 0,
            width: 3200,
            height: 670,
        },
        {
            type: 'background-layer-01',
            x: 0,
            y: 0,
            width: 3200,
            height: 670,
        },
        {
            type: 'ground-06',
            x: 0,
            y: 650,
            width: 3200,
            height: 1600,
        }
    ],
    buildings: [
        {
            type: 'building-shop',
            x: 1200,
            y: 650
        }
    ],
    platforms: [
        // Plataforma principal que recorre todo el mapa
        {
            type: 'ground-02',
            x: 0,
            y: 650,
            width: 3200,
            height: 128
        },
    ],
    decorations: [
        {
            type: 'tree-02',
            x: 100,
            y: 650
        },
        {
            type: 'grass-03',
            x: 110,
            y: 650
        },
        {
            type: 'grass-03',
            x: 240,
            y: 650
        },
        {
            type: 'tree-02',
            x: 250,
            y: 650
        },
        {
            type: 'grass-03',
            x: 280,
            y: 650
        },
        {
            type: 'wooden-barrel',
            x: 400,
            y: 650
        },
        {
            type: 'quest-board',
            x: 450,
            y: 650
        },
        {
            type: 'tree-02',
            x: 800,
            y: 650
        },
        {
            type: 'grass-03',
            x: 820,
            y: 650
        },
        {
            type: 'tree-02',
            x: 1500,
            y: 650
        },
        {
            type: 'grass-03',
            x: 1505,
            y: 650
        },
        // Elementos de combate
        {
            type: 'stand-spear',
            x: 900,
            y: 650
        },
    ],
    spawnPoints: {
        player: { x: 800, y: 550, type: 'player' },
        enemies: []
    },
    collisionLayers: [
        // Plataforma principal
        { x: 0, y: 654, width: 3200, height: 64, type: 'ground' },
    ]
};