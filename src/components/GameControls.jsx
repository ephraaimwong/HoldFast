import React, { useState, useEffect, useRef } from 'react';
import '../App.css';

const GameControls = ({ onGameStateChange }) => {
    const [isGameActive, setIsGameActive] = useState(false);
    const [timeDisplay, setTimeDisplay] = useState("00:00");
    const lineRef = useRef(null);

    const toggleGame = () => {
        const newState = !isGameActive;
        setIsGameActive(newState);

        if (onGameStateChange) {
            onGameStateChange(newState);
        }
    };

    // Update timer display from line component's timer
    useEffect(() => {
        if (isGameActive && lineRef.current) {
            const timerInterval = setInterval(() => {
                const currentTime = lineRef.current.getCurrentTime();
                const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
                const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
                setTimeDisplay(`${minutes}:${seconds}`);

                // Check if game ended by time
                if (currentTime >= 30) { // 30 second default from WrappingLine
                    setIsGameActive(false);
                    clearInterval(timerInterval);
                    if (onGameStateChange) {
                        onGameStateChange(false);
                    }
                }
            }, 100);

            return () => clearInterval(timerInterval);
        }
    }, [isGameActive, onGameStateChange]);

    return (
        <div className="game-controls">
            <button
                className={`play-button ${isGameActive ? 'active' : ''}`}
                onClick={toggleGame}
            >
                {isGameActive ? 'PAUSE' : 'PLAY'}
            </button>
            <div className="timer">{timeDisplay}</div>
        </div>
    );
};

export default GameControls; 