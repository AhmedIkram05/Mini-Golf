import { initGame, gameLoop, setMute, customizeBall } from './game.js';
import { renderStatsPanel } from './statistics.js';
import { startTutorial } from './tutorial.js';
import { achievements } from './achievements.js';

initGame();
gameLoop();

// Initialize stats panel
renderStatsPanel('stats');

// Initialize achievements panel if it exists
if (document.getElementById('achievements')) {
    achievements.renderAchievementsPanel('achievements');
}

// Add event listeners for game controls
document.getElementById('rulesBtn').addEventListener('click', () => {
    const rulesModal = document.createElement('div');
    rulesModal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-30';
    rulesModal.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-md">
            <h2 class="text-2xl font-bold mb-4">How to Play</h2>
            <ul class="list-disc pl-6 mb-4">
                <li>Click to aim and hit the ball</li>
                <li>Use the power slider to control shot strength</li>
                <li>Try to complete each hole in as few strokes as possible</li>
                <li>Watch out for obstacles and water hazards!</li>
            </ul>
            <div class="text-right">
                <button id="closeRulesBtn" class="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(rulesModal);
    
    // Fix: Add event listener directly after appending to ensure the element exists
    document.getElementById('closeRulesBtn').addEventListener('click', () => {
        document.body.removeChild(rulesModal);
    });
});

// Check if first time player
if (!localStorage.getItem('tutorialComplete')) {
    // Add tutorial button to main menu
    const tutorialBtn = document.createElement('button');
    tutorialBtn.id = 'tutorialBtn';
    tutorialBtn.className = 'bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 ml-4';
    tutorialBtn.textContent = 'Tutorial';
    
    document.querySelector('.fixed.bottom-5').appendChild(tutorialBtn);
    
    document.getElementById('tutorialBtn').addEventListener('click', () => {
        startTutorial();
    });
}

// Add event listener for mute button
if (document.getElementById('muteBtn')) {
    document.getElementById('muteBtn').addEventListener('click', function() {
        // Update the mute status and icon
        const isMuted = this.textContent === '🔊';
        this.textContent = isMuted ? '🔇' : '🔊';
        setMute(isMuted);
    });
}

// Add event listener for customize button
if (document.getElementById('customizeBtn')) {
    document.getElementById('customizeBtn').addEventListener('click', function() {
        const customizeModal = document.createElement('div');
        customizeModal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-30';
        customizeModal.innerHTML = `
            <div class="bg-white p-6 rounded-lg max-w-md">
                <h2 class="text-2xl font-bold mb-4">Customize Your Ball</h2>
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Ball Color</label>
                    <div class="grid grid-cols-5 gap-2">
                        <div class="w-8 h-8 bg-white border border-gray-300 rounded-full cursor-pointer" data-color="#ffffff"></div>
                        <div class="w-8 h-8 bg-red-500 rounded-full cursor-pointer" data-color="#ef4444"></div>
                        <div class="w-8 h-8 bg-blue-500 rounded-full cursor-pointer" data-color="#3b82f6"></div>
                        <div class="w-8 h-8 bg-green-500 rounded-full cursor-pointer" data-color="#10b981"></div>
                        <div class="w-8 h-8 bg-yellow-400 rounded-full cursor-pointer" data-color="#facc15"></div>
                        <div class="w-8 h-8 bg-purple-500 rounded-full cursor-pointer" data-color="#8b5cf6"></div>
                        <div class="w-8 h-8 bg-pink-500 rounded-full cursor-pointer" data-color="#ec4899"></div>
                        <div class="w-8 h-8 bg-orange-500 rounded-full cursor-pointer" data-color="#f97316"></div>
                        <div class="w-8 h-8 bg-teal-500 rounded-full cursor-pointer" data-color="#14b8a6"></div>
                        <div class="w-8 h-8 bg-gray-800 rounded-full cursor-pointer" data-color="#1f2937"></div>
                    </div>
                </div>
                <div class="text-right">
                    <button id="closeCustomizeBtn" class="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 mr-2">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(customizeModal);
        
        // Add event listeners to color options
        customizeModal.querySelectorAll('[data-color]').forEach(colorEl => {
            colorEl.addEventListener('click', () => {
                const color = colorEl.getAttribute('data-color');
                customizeBall({ color });
                
                // Add selected indicator
                customizeModal.querySelectorAll('[data-color]').forEach(el => {
                    el.style.boxShadow = 'none';
                });
                colorEl.style.boxShadow = '0 0 0 3px #000, 0 0 0 5px white';
            });
        });
        
        // Close button functionality
        document.getElementById('closeCustomizeBtn').addEventListener('click', () => {
            document.body.removeChild(customizeModal);
        });
    });
}

// Add event listener for editor button (if present)
if (document.getElementById('editorBtn')) {
    document.getElementById('editorBtn').addEventListener('click', () => {
        window.location.href = 'editor.html';
    });
}