// This is the main entry point that re-exports key functionality

import { initGameCore, gameLoop, setIsMuted, startMultiplayer } from './gameCore.js';
import { ball } from './ball.js';

// Re-export main game functions
export { initGameCore as initGame, gameLoop };

// Function to set mute status
export function setMute(mute) {
    setIsMuted(mute);
}

// Function to customize ball
export function customizeBall(options) {
    if (options.color) {
        ball.color = options.color;
        // Save preference to localStorage
        localStorage.setItem('ballColor', options.color);
    }
}

// Start multiplayer game function
export function startMultiplayerGame(playerCount) {
    startMultiplayer(playerCount);
}
