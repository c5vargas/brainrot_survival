# Guía de Estructura y Buenas Prácticas del Proyecto

Este documento define las reglas que toda IA (y humanos) deben seguir al generar, modificar o extender este proyecto.

# Introducción del proyecto

## Objetivo del Juego
El jugador controla a un personaje en un mundo hostil y abierto, en el que debe sobrevivir, explorar, recoger recursos, crear objetos y estructuras, combatir enemigos y mejorar su personaje a lo largo del tiempo.ç

## Estilo del Juego
- Género: Supervivencia / RPG / Top-down Pixel Art
- Cámara: Vista cenital (top-down 2D)
- Resolución base de sprites: 32x32 px
- Estética: Pixel art clásico, estilo retro
- Inspiración: Stardew Valley, Don't Starve, Forager, Project Zomboid (2D)

## Mecánicas Principales

### Recolección y Crafting
El jugador puede recolectar materiales como madera, piedra, plantas, etc.

### Sistema de inventario con peso o slots.
Crafteo de herramientas, armas y estructuras.

### Combate
- Sistema de enemigos (esqueletos, orcos, etc.) con IA básica.
- Ataques cuerpo a cuerpo y a distancia (arco, magia).
- Progresión de dificultad con zonas más peligrosas.

### Mejora de Personaje
- Subida de nivel o mejora de estadísticas (vida, daño, velocidad).
- Posibilidad de desbloquear habilidades o talentos.

## Entorno Interactivo
- Exploración de bosques, cuevas y otras zonas usando los tilesets del asset pack.
- Elementos como cofres, hornos, mesas de trabajo, etc.
- Día y Noche (opcional)
- Ciclo de tiempo con variaciones en enemigos y luz.

# Stack del Proyecto
Motor de juego: PhaserJS 3
Framework UI: React
Lenguaje: TypeScript
Bundler: Vite

Arquitectura esperada: Modular, escalable, orientada a componentes y sistemas

## Reglas para Código PhaserJS

### Estructura recomendada

```
src/
├── assets/          → Imágenes, sonidos, fuentes, tilemaps
├── config/          → Configuraciones generales y constantes
├── core/            → Inicialización del juego, config principal
├── entities/        → Jugador, enemigos, NPCs (con lógica propia)
├── scenes/          → Cada escena como clase: Boot, Menu, Game, UI
├── systems/         → Controladores generales (inventario, combate, tiempo, etc)
├── ui/              → Elementos visuales como HUD, menú, botones
└── utils/           → Funciones y helpers reutilizables
```

### Estilo y convenciones
- Cada escena es una clase en su propio archivo.
- Nunca mezcles lógicas de múltiples sistemas dentro de una escena.
- El update() de las escenas debe delegar a sistemas y entidades.
- Usa inyección de dependencias para comunicar escenas o entidades.
- Separar sprites de lógica (usar entidades o componentes).
- Mantener el GameConfig limpio y separado (core/game.ts).
- Los assets deben cargarse en la BootScene y nunca sobre la marcha.

## Reglas para React

### Estructura recomendada

```
src/
├── game/            → Integración de Phaser con React
│   ├── App.tsx
│   ├── main.tsx
│   └── PhaserGame.tsx
├── components/      → Componentes React puros y reutilizables
├── hooks/           → Custom hooks para lógica compartida
├── context/         → React context API para manejar estados globales
├── pages/           → Vistas principales (si aplica)
└── styles/          → Estilos globales o modulares
```

### Estilo y convenciones
- Usa Componentes Funcionales y Hooks siempre.
- Separar lógica de presentación (smart/dumb components).
- Cada componente en su propio archivo (si pasa de 30 líneas).
- Evita lógica duplicada: usar hooks reutilizables.
- Todos los componentes deben tener tipado estricto (sin any).
- Usar useMemo, useCallback y React.memo cuando corresponda.
- Estados globales deben ir en context/ o con zustand si se usa.
- Nunca mezcles lógica de Phaser dentro de los componentes de UI.

## Inteligencia Artificial: Prohibido Generar…
❌ Código duplicado
❌ Archivos mezclando lógicas múltiples
❌ Funciones anónimas dentro del render()
❌ any como tipo
❌ Assets dentro del código fuente (usar public/ o assets/)
❌ Lógica de juego dentro de React o viceversa

## Siempre Debes...
✔ Generar código modular, limpio y escalable
✔ Comentar código complejo con contexto útil
✔ Usar nombres claros y consistentes (camelCase, PascalCase)
✔ Priorizar legibilidad sobre "trucos" técnicos
✔ Crear una función o archivo separado si algo crece o se repite

## Testing y Mejora Continua
- Opcional: usar Vitest o Jest para pruebas unitarias.
- Siempre dejar espacio para la escalabilidad.
- Facilitar el debug con logs bien ubicados (no excesivos).
- Proveer ejemplos de uso si generas un hook o componente nuevo.


Este archivo puede crecer con nuevas reglas a medida que evoluciona el proyecto. ¡Respétalo como la Biblia del código! 📘