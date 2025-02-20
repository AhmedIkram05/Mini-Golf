const LEADERBOARD_KEY = 'golfLeaderboard';

export function saveScore(newScore) {
    // Get current leaderboard or empty array
    const leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
    leaderboard.push({ score: newScore, date: new Date().toLocaleString() });
    leaderboard.sort((a, b) => a.score - b.score);
    const topScores = leaderboard.slice(0, 10);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topScores));
}

export function getLeaderboard() {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
}

export function renderLeaderboard(elementId) {
    const leaderboardElement = document.getElementById(elementId);
    let scores = getLeaderboard();
    // If no data, provide fake sample leaderboard entries
    if (scores.length === 0) {
        scores = [
            { score: 8, date: "1/1/2023 10:00 AM" },
            { score: 10, date: "1/2/2023 11:30 AM" },
            { score: 12, date: "1/3/2023 9:15 AM" }
        ];
    }
    let html = '<h2>Leaderboard</h2><ol>';
    scores.forEach(item => {
        html += `<li>${item.score} strokes - ${item.date}</li>`;
    });
    html += '</ol>';
    leaderboardElement.innerHTML = html;
}
