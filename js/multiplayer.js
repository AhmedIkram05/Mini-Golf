// Create a simple local multiplayer system

export const multiplayer = {
    players: [],
    currentPlayerIndex: 0,
    maxPlayers: 4,
    
    init() {
        this.players = [];
        this.currentPlayerIndex = 0;
    },
    
    addPlayer(name, ballColor) {
        if (this.players.length >= this.maxPlayers) {
            return false;
        }
        
        this.players.push({
            name: name,
            ballColor: ballColor || this.getDefaultColor(this.players.length),
            score: 0,
            totalScore: 0,
            levelScores: []
        });
        
        return true;
    },
    
    getDefaultColor(index) {
        const colors = ['#ff0000', '#0000ff', '#00cc00', '#ffcc00'];
        return colors[index % colors.length];
    },
    
    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        return this.getCurrentPlayer();
    },
    
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    },
    
    recordScore(levelScore) {
        const player = this.getCurrentPlayer();
        player.score += levelScore;
        player.levelScores.push(levelScore);
    },
    
    getScoreboard() {
        return this.players.map(p => ({
            name: p.name,
            score: p.score,
            levelScores: p.levelScores
        })).sort((a, b) => a.score - b.score);
    }
};
