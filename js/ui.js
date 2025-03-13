export function showGameSummary(score, totalPar, resetGameCallback) {
    let scoreDiff = score - totalPar;
    
    const summary = document.createElement('div');
    summary.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20';
    summary.innerHTML = `
        <div class="bg-white p-8 rounded-lg text-center max-w-md">
            <h2 class="text-3xl font-bold mb-6">Game Complete!</h2>
            <p class="text-xl mb-4">Total Score: ${score}</p>
            <p class="text-xl mb-4">Course Par: ${totalPar}</p>
            <p class="text-2xl font-semibold mb-6">${scoreDiff === 0 ? 'Even Par' : (scoreDiff > 0 ? `${scoreDiff} Over Par` : `${Math.abs(scoreDiff)} Under Par`)}</p>
            <div class="flex justify-center space-x-4">
                <button id="playAgainBtn" class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Play Again</button>
                <button id="closeBtn" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(summary);
    
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        document.body.removeChild(summary);
        resetGameCallback();
    });
    
    document.getElementById('closeBtn').addEventListener('click', () => {
        document.body.removeChild(summary);
    });
}

export function showMultiplayerGameSummary(multiplayer) {
    const scoreboard = multiplayer.getScoreboard();
    const winner = scoreboard[0]; // Players are sorted by score
    
    const summary = document.createElement('div');
    summary.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20';
    
    let playerRows = '';
    scoreboard.forEach((player, index) => {
        playerRows += `
            <tr class="${index === 0 ? 'font-bold bg-green-100' : ''}">
                <td class="px-4 py-2">${index + 1}</td>
                <td class="px-4 py-2">${player.name}</td>
                <td class="px-4 py-2">${player.score}</td>
            </tr>
        `;
    });
    
    summary.innerHTML = `
        <div class="bg-white p-8 rounded-lg text-center max-w-md">
            <h2 class="text-3xl font-bold mb-6">Game Complete!</h2>
            <p class="text-xl mb-4">${winner.name} Wins!</p>
            <div class="overflow-auto max-h-60 mb-6">
                <table class="w-full border-collapse">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="px-4 py-2">Rank</th>
                            <th class="px-4 py-2">Name</th>
                            <th class="px-4 py-2">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${playerRows}
                    </tbody>
                </table>
            </div>
            <div class="flex justify-center space-x-4">
                <button id="playAgainBtn" class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Play Again</button>
                <button id="closeBtn" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(summary);
    
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        document.body.removeChild(summary);
        window.location.reload(); // Simplest way to restart a multiplayer game
    });
    
    document.getElementById('closeBtn').addEventListener('click', () => {
        document.body.removeChild(summary);
    });
}

export function showPowerupNotification(powerup) {
    const message = document.createElement('div');
    message.className = 'fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-purple-700 text-white py-2 px-6 rounded-lg shadow-lg text-lg font-medium animate-bounce';
    message.innerHTML = `${powerup.icon} ${powerup.name} Activated! (${powerup.duration} shots)`;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => document.body.removeChild(message), 500);
    }, 2000);
}

export function createModal(title, content, buttons) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-30';
    
    let buttonsHTML = '';
    buttons.forEach(button => {
        buttonsHTML += `<button id="${button.id}" class="${button.classes}">${button.text}</button>`;
    });
    
    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-md">
            <h2 class="text-2xl font-bold mb-4">${title}</h2>
            <div class="mb-4">${content}</div>
            <div class="flex justify-end space-x-2">
                ${buttonsHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Return modal element so event listeners can be attached
    return modal;
}
