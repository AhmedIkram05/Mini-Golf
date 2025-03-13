// Create an achievements system

const ACHIEVEMENTS_KEY = 'golfAchievements';

export const achievements = {
    list: [
        {
            id: 'first_game',
            name: 'First Steps',
            description: 'Complete your first game',
            icon: '🏌️',
            earned: false,
            secret: false
        },
        {
            id: 'hole_in_one',
            name: 'Ace!',
            description: 'Get a hole in one',
            icon: '🎯',
            earned: false,
            secret: false
        },
        {
            id: 'under_par',
            name: 'Under Par',
            description: 'Complete a course under par',
            icon: '⭐',
            earned: false,
            secret: false
        },
        {
            id: 'perfectionist',
            name: 'Perfectionist',
            description: 'Complete all holes at or under par',
            icon: '🏆',
            earned: false,
            secret: false
        },
        {
            id: 'water_hazard',
            name: 'Splash!',
            description: 'Hit your ball into a water hazard',
            icon: '💧',
            earned: false,
            secret: true
        }
    ],
    
    init() {
        // Load saved achievements
        const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
        if (saved) {
            const savedAchievements = JSON.parse(saved);
            // Update earned status from saved data
            this.list.forEach(achievement => {
                const savedAchievement = savedAchievements.find(a => a.id === achievement.id);
                if (savedAchievement) {
                    achievement.earned = savedAchievement.earned;
                }
            });
        }
    },
    
    save() {
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(this.list));
    },
    
    unlock(id) {
        const achievement = this.list.find(a => a.id === id);
        if (achievement && !achievement.earned) {
            achievement.earned = true;
            this.save();
            this.showNotification(achievement);
        }
    },
    
    checkForAchievements(gameStats) {
        // Check for first game
        if (!this.list.find(a => a.id === 'first_game').earned) {
            this.unlock('first_game');
        }
        
        // Check for hole in one
        if (gameStats.holeInOnes > 0 && !this.list.find(a => a.id === 'hole_in_one').earned) {
            this.unlock('hole_in_one');
        }
        
        // Check for under par
        if (gameStats.totalScore < gameStats.coursePar && !this.list.find(a => a.id === 'under_par').earned) {
            this.unlock('under_par');
        }
        
        // Check for perfectionist
        if (gameStats.perfectScore && !this.list.find(a => a.id === 'perfectionist').earned) {
            this.unlock('perfectionist');
        }
        
        // Check for water hazard
        if (gameStats.waterHazards > 0 && !this.list.find(a => a.id === 'water_hazard').earned) {
            this.unlock('water_hazard');
        }
    },
    
    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-20 right-5 bg-black bg-opacity-80 text-white p-4 rounded shadow-lg z-50 transition-opacity duration-500';
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="text-2xl mr-3">${achievement.icon}</span>
                <div>
                    <div class="font-bold">${achievement.name}</div>
                    <div class="text-sm">${achievement.description}</div>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Fade out and remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 4500);
    },
    
    renderAchievementsPanel(elementId) {
        const panel = document.getElementById(elementId);
        let html = `
            <h2 class="text-xl font-bold mb-4">Achievements</h2>
            <div class="grid grid-cols-1 gap-2">
        `;
        
        this.list.forEach(achievement => {
            // Skip secret achievements that haven't been earned yet
            if (achievement.secret && !achievement.earned) {
                html += `
                    <div class="p-3 bg-gray-200 rounded shadow-sm opacity-50">
                        <div class="flex items-center">
                            <span class="text-2xl mr-3">?</span>
                            <div>
                                <div class="font-medium">Secret Achievement</div>
                                <div class="text-sm">Keep playing to discover</div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                const bgColor = achievement.earned ? 'bg-green-100' : 'bg-gray-100';
                const textColor = achievement.earned ? 'text-green-800' : 'text-gray-600';
                const opacity = achievement.earned ? 'opacity-100' : 'opacity-60';
                
                html += `
                    <div class="p-3 ${bgColor} rounded shadow-sm ${opacity}">
                        <div class="flex items-center">
                            <span class="text-2xl mr-3">${achievement.icon}</span>
                            <div>
                                <div class="font-medium ${textColor}">${achievement.name}</div>
                                <div class="text-sm">${achievement.description}</div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        panel.innerHTML = html;
    }
};
