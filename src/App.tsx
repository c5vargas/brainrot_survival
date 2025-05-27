import { useRef } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div className="game-container">
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;
