// Create a level editor that allows users to create their own mini golf courses

const CUSTOM_LEVELS_KEY = 'customGolfLevels';

export const levelEditor = {
    canvas: null,
    ctx: null,
    width: 800,
    height: 600,
    mode: 'select', // select, obstacle, water, start, hole
    currentLevel: {
        name: "Custom Level",
        startXPercent: 0.5,
        startYPercent: 0.8,
        holeXPercent: 0.5,
        holeYPercent: 0.2,
        holeRadius: 15,
        holeColor: '#000000',
        par: 3,
        theme: {
            background: '#69b578',
            borderColor: '#2d6a4f'
        },
        obstacles: [],
        waterHazards: []
    },
    selectedElement: null,
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    
    init(canvasEl) {
        this.canvas = canvasEl;
        this.ctx = canvasEl.getContext('2d');
        
        this.setupEventListeners();
        this.draw();
    },
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Add tool selection buttons
        document.getElementById('selectTool').addEventListener('click', () => this.setMode('select'));
        document.getElementById('obstacleTool').addEventListener('click', () => this.setMode('obstacle'));
        document.getElementById('waterTool').addEventListener('click', () => this.setMode('water'));
        document.getElementById('startTool').addEventListener('click', () => this.setMode('start'));
        document.getElementById('holeTool').addEventListener('click', () => this.setMode('hole'));
        
        document.getElementById('saveLevel').addEventListener('click', () => this.saveLevel());
        document.getElementById('testLevel').addEventListener('click', () => this.testLevel());
        document.getElementById('clearLevel').addEventListener('click', () => this.clearLevel());
    },
    
    setMode(mode) {
        this.mode = mode;
        // Update UI to show active tool
        document.querySelectorAll('.editor-tool').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${mode}Tool`).classList.add('active');
    },
    
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.mode === 'select') {
            // Check if clicking on existing elements
            this.selectedElement = this.getElementAtPosition(x, y);
            if (this.selectedElement) {
                this.isDragging = true;
                this.dragOffset.x = x - this.selectedElement.x;
                this.dragOffset.y = y - this.selectedElement.y;
            }
        } else if (this.mode === 'obstacle') {
            // Add new obstacle
            this.currentLevel.obstacles.push({
                x: x - 40, // Center the obstacle on cursor
                y: y - 5,  // Center the obstacle on cursor
                width: 80,
                height: 10,
                color: '#3f51b5'
            });
        } else if (this.mode === 'water') {
            // Add new water hazard
            this.currentLevel.waterHazards.push({
                x: x - 30, // Center on cursor
                y: y - 20, // Center on cursor
                width: 60,
                height: 40,
                color: 'rgba(0, 128, 255, 0.5)'
            });
        } else if (this.mode === 'start') {
            this.currentLevel.startXPercent = x / this.width;
            this.currentLevel.startYPercent = y / this.height;
        } else if (this.mode === 'hole') {
            this.currentLevel.holeXPercent = x / this.width;
            this.currentLevel.holeYPercent = y / this.height;
        }
        
        this.draw();
    },
    
    handleMouseMove(e) {
        if (this.isDragging && this.selectedElement) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.selectedElement.x = x - this.dragOffset.x;
            this.selectedElement.y = y - this.dragOffset.y;
            
            this.draw();
        }
    },
    
    handleMouseUp() {
        this.isDragging = false;
    },
    
    getElementAtPosition(x, y) {
        // Check obstacles
        for (let i = this.currentLevel.obstacles.length - 1; i >= 0; i--) {
            const obs = this.currentLevel.obstacles[i];
            if (x >= obs.x && x <= obs.x + obs.width &&
                y >= obs.y && y <= obs.y + obs.height) {
                return obs;
            }
        }
        
        // Check water hazards
        for (let i = this.currentLevel.waterHazards.length - 1; i >= 0; i--) {
            const hazard = this.currentLevel.waterHazards[i];
            if (x >= hazard.x && x <= hazard.x + hazard.width &&
                y >= hazard.y && y <= hazard.y + hazard.height) {
                return hazard;
            }
        }
        
        // Check start position
        const startX = this.currentLevel.startXPercent * this.width;
        const startY = this.currentLevel.startYPercent * this.height;
        if (Math.hypot(x - startX, y - startY) < 15) {
            return { type: 'start' };
        }
        
        // Check hole position
        const holeX = this.currentLevel.holeXPercent * this.width;
        const holeY = this.currentLevel.holeYPercent * this.height;
        if (Math.hypot(x - holeX, y - holeY) < 15) {
            return { type: 'hole' };
        }
        
        return null;
    },
    
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw background
        this.ctx.fillStyle = this.currentLevel.theme.background;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw water hazards
        this.currentLevel.waterHazards.forEach(hazard => {
            this.ctx.fillStyle = hazard.color;
            this.ctx.fillRect(hazard.x, hazard.y, hazard.width, hazard.height);
            
            // Add water effect
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(hazard.x, hazard.y + 5 + i * 8);
                this.ctx.lineTo(hazard.x + hazard.width, hazard.y + 5 + i * 8);
                this.ctx.stroke();
            }
        });
        
        // Draw obstacles
        this.currentLevel.obstacles.forEach(obs => {
            this.ctx.fillStyle = obs.color;
            this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
        
        // Draw start position
        const startX = this.currentLevel.startXPercent * this.width;
        const startY = this.currentLevel.startYPercent * this.height;
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, 10, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw hole position
        const holeX = this.currentLevel.holeXPercent * this.width;
        const holeY = this.currentLevel.holeYPercent * this.height;
        this.ctx.fillStyle = this.currentLevel.holeColor;
        this.ctx.beginPath();
        this.ctx.arc(holeX, holeY, this.currentLevel.holeRadius, 0, Math.PI * 2);
        this.ctx.fill();
    },
    
    convertToPercentages() {
        const converted = { ...this.currentLevel };
        
        // Convert obstacles to percentage-based coordinates
        converted.obstacles = this.currentLevel.obstacles.map(obs => ({
            xPercent: obs.x / this.width,
            yPercent: obs.y / this.height,
            widthPercent: obs.width / this.width,
            heightPercent: obs.height / this.height,
            color: obs.color
        }));
        
        // Convert water hazards to percentage-based coordinates
        converted.waterHazards = this.currentLevel.waterHazards.map(hazard => ({
            xPercent: hazard.x / this.width,
            yPercent: hazard.y / this.height,
            widthPercent: hazard.width / this.width,
            heightPercent: hazard.height / this.height,
            color: hazard.color
        }));
        
        return converted;
    },
    
    saveLevel() {
        const levelName = prompt("Enter a name for your level:", this.currentLevel.name);
        if (levelName) {
            const level = this.convertToPercentages();
            level.name = levelName;
            
            // Get existing custom levels
            const savedLevels = JSON.parse(localStorage.getItem(CUSTOM_LEVELS_KEY)) || [];
            savedLevels.push(level);
            
            localStorage.setItem(CUSTOM_LEVELS_KEY, JSON.stringify(savedLevels));
            alert(`Level "${levelName}" saved successfully!`);
        }
    },
    
    testLevel() {
        const level = this.convertToPercentages();
        // Store current level in session storage for testing
        sessionStorage.setItem('testLevel', JSON.stringify(level));
        // Navigate to test page
        window.location.href = 'test-level.html';
    },
    
    clearLevel() {
        if (confirm("Are you sure you want to clear this level?")) {
            this.currentLevel.obstacles = [];
            this.currentLevel.waterHazards = [];
            this.draw();
        }
    },
    
    loadLevel(level) {
        this.currentLevel = {
            ...level,
            obstacles: [],
            waterHazards: []
        };
        
        // Convert percentage coordinates back to pixels
        if (level.obstacles) {
            level.obstacles.forEach(obs => {
                this.currentLevel.obstacles.push({
                    x: obs.xPercent * this.width,
                    y: obs.yPercent * this.height,
                    width: obs.widthPercent * this.width,
                    height: obs.heightPercent * this.height,
                    color: obs.color
                });
            });
        }
        
        if (level.waterHazards) {
            level.waterHazards.forEach(hazard => {
                this.currentLevel.waterHazards.push({
                    x: hazard.xPercent * this.width,
                    y: hazard.yPercent * this.height,
                    width: hazard.widthPercent * this.width,
                    height: hazard.heightPercent * this.height,
                    color: hazard.color
                });
            });
        }
        
        this.draw();
    }
};
