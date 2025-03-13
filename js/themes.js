export const themes = {
    standard: {
        name: 'Standard',
        background: '#69b578',
        borderColor: '#2d6a4f',
        obstacleColor: '#3f51b5',
        waterColor: 'rgba(0, 128, 255, 0.5)',
        ballColor: '#ffffff',
        holeColor: '#000000'
    },
    desert: {
        name: 'Desert',
        background: '#f4a261',
        borderColor: '#e76f51',
        obstacleColor: '#d62828',
        waterColor: 'rgba(0, 128, 255, 0.5)',
        sandColor: '#ffdd80',
        ballColor: '#ffffff',
        holeColor: '#000000'
    },
    night: {
        name: 'Night',
        background: '#023047',
        borderColor: '#219ebc',
        obstacleColor: '#8ecae6',
        waterColor: 'rgba(0, 77, 153, 0.6)',
        ballColor: '#ffffff',
        holeColor: '#000000',
        effects: {
            stars: true,
            glow: true
        }
    },
    space: {
        name: 'Space',
        background: '#0d1b2a',
        borderColor: '#415a77',
        obstacleColor: '#778da9',
        waterColor: 'rgba(80, 0, 255, 0.5)',
        holeColor: '#000000',
        ballColor: '#ffffff',
        effects: {
            stars: true,
            nebula: true,
            gravityWells: true
        }
    },
    winter: {
        name: 'Winter',
        background: '#f8f9fa',
        borderColor: '#dee2e6',
        obstacleColor: '#adb5bd',
        waterColor: 'rgba(166, 216, 255, 0.7)',
        iceColor: 'rgba(200, 240, 255, 0.8)',
        snowColor: '#ffffff',
        ballColor: '#ff4d6d',
        holeColor: '#000000',
        effects: {
            snow: true,
            ice: true
        }
    },
    
    applyTheme(levelConfig, themeName) {
        const theme = this[themeName];
        if (!theme) return levelConfig;
        
        // Apply theme colors
        levelConfig.theme = {
            background: theme.background,
            borderColor: theme.borderColor
        };
        
        // Apply obstacle colors
        if (levelConfig.obstacles) {
            levelConfig.obstacles.forEach(obstacle => {
                obstacle.color = theme.obstacleColor;
            });
        }
        
        // Apply water colors
        if (levelConfig.waterHazards) {
            levelConfig.waterHazards.forEach(hazard => {
                hazard.color = theme.waterColor;
            });
        }
        
        // Apply sand bunker colors
        if (levelConfig.sandBunkers) {
            levelConfig.sandBunkers.forEach(bunker => {
                bunker.color = theme.sandColor || '#e6c986';
            });
        }
        
        // Apply hole color
        levelConfig.holeColor = theme.holeColor;
        
        // Add theme-specific features
        if (theme.effects) {
            levelConfig.effects = theme.effects;
        }
        
        return levelConfig;
    },
    
    applyRandomTheme(levelConfig) {
        const themeNames = Object.keys(this).filter(key => typeof this[key] === 'object');
        const randomTheme = themeNames[Math.floor(Math.random() * themeNames.length)];
        return this.applyTheme(levelConfig, randomTheme);
    }
};
