const STATS_KEY = 'golfStats';

export function savePlayerStats(playerName, totalScore, parDifference, levelScores) {
    const stats = getPlayerStats();
    
    const existingPlayerIndex = stats.findIndex(player => player.name === playerName);
    const gamesPlayed = existingPlayerIndex >= 0 ? stats[existingPlayerIndex].gamesPlayed + 1 : 1;
    const bestScore = existingPlayerIndex >= 0 ? 
        Math.min(stats[existingPlayerIndex].bestScore, totalScore) : totalScore;
    
    const playerData = {
        name: playerName,
        gamesPlayed: gamesPlayed,
        lastPlayed: new Date().toLocaleString(),
        bestScore: bestScore,
        lastScore: totalScore,
        lastParDifference: parDifference,
        totalHoleInOne: countHoleInOnes(levelScores)
    };
    
    if (existingPlayerIndex >= 0) {
        stats[existingPlayerIndex] = playerData;
    } else {
        stats.push(playerData);
    }
    
    // Sort by best score
    stats.sort((a, b) => a.bestScore - b.bestScore);
    
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function countHoleInOnes(levelScores) {
    return levelScores.filter(strokes => strokes === 1).length;
}

export function getPlayerStats() {
    return JSON.parse(localStorage.getItem(STATS_KEY)) || [];
}

export function renderStatsPanel(elementId) {
    const statsElement = document.getElementById(elementId);
    const stats = getPlayerStats();
    
    if (stats.length === 0) {
        statsElement.innerHTML = '<h2>Player Statistics</h2><p>No stats available yet.</p>';
        return;
    }
    
    let html = '<h2 class="text-xl font-bold mb-4">Player Statistics</h2><div class="space-y-2">';
    
    stats.forEach((player, index) => {
        html += `
            <div class="p-3 bg-green-50 rounded shadow-sm">
                <div class="font-medium">${index + 1}. ${player.name}</div>
                <div class="text-sm">Best Score: ${player.bestScore}</div>
                <div class="text-sm">Games: ${player.gamesPlayed}</div>
                <div class="text-sm">Hole-in-Ones: ${player.totalHoleInOne}</div>
            </div>
        `;
    });
    
    html += '</div>';
    statsElement.innerHTML = html;
}
