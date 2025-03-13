// Create a new file for tutorial functionality

export function startTutorial() {
    let currentStep = 0;
    const tutorialSteps = [
        {
            title: "Welcome to Mini Golf!",
            text: "This tutorial will guide you through the basics of playing.",
            position: 'center'
        },
        {
            title: "The Goal",
            text: "Get the ball into the hole with as few strokes as possible.",
            position: 'hole'
        },
        {
            title: "Aiming",
            text: "Click and move your mouse to aim where you want to hit the ball.",
            position: 'ball',
            action: 'aim'
        },
        {
            title: "Power",
            text: "Use the power slider to determine how hard to hit the ball.",
            position: 'slider'
        },
        {
            title: "Obstacles",
            text: "Avoid obstacles on the course or use them to your advantage.",
            position: 'obstacles'
        },
        {
            title: "Water Hazards",
            text: "Avoid water hazards! Your ball will reset with a penalty stroke.",
            position: 'water'
        },
        {
            title: "Par Score",
            text: "Each hole has a target 'par' score. Try to match or beat it!",
            position: 'par'
        },
        {
            title: "Ready to Play!",
            text: "You're ready to start playing. Good luck!",
            position: 'center'
        }
    ];

    function showTutorialStep(step) {
        // Remove existing overlay if it exists
        const existingOverlay = document.getElementById('tutorialOverlay');
        if (existingOverlay) {
            document.body.removeChild(existingOverlay);
        }
        
        const tutorialOverlay = document.createElement('div');
        tutorialOverlay.id = 'tutorialOverlay';
        tutorialOverlay.className = 'fixed inset-0 z-40 pointer-events-none';
        
        let position = '';
        if (step.position === 'center') {
            position = 'flex items-center justify-center';
        } else if (step.position === 'ball') {
            // Position near the ball
            position = 'flex items-center justify-center'; // Default to center for now
        } else if (step.position === 'hole') {
            // Position near the hole
            position = 'flex items-center justify-center'; // Default to center for now
        } else if (step.position === 'slider') {
            position = 'flex items-center justify-start ml-20';
        } else if (step.position === 'par') {
            position = 'flex items-start justify-center pt-20';
        } else {
            // Default to center
            position = 'flex items-center justify-center';
        }
        
        tutorialOverlay.innerHTML = `
            <div class="pointer-events-auto ${position} h-full">
                <div class="bg-white rounded-lg shadow-xl p-6 max-w-md">
                    <h3 class="text-xl font-bold mb-2">${step.title}</h3>
                    <p class="mb-4">${step.text}</p>
                    <div class="flex justify-between">
                        ${currentStep > 0 ? 
                            '<button id="prevTutorialStep" class="bg-gray-500 text-white py-1 px-3 rounded">Back</button>' : 
                            '<div></div>'}
                        ${currentStep < tutorialSteps.length - 1 ? 
                            '<button id="nextTutorialStep" class="bg-blue-600 text-white py-1 px-3 rounded">Next</button>' : 
                            '<button id="finishTutorial" class="bg-green-600 text-white py-1 px-3 rounded">Start Playing</button>'}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(tutorialOverlay);
        
        // Add event listeners after the element is in the DOM
        if (currentStep > 0) {
            document.getElementById('prevTutorialStep').addEventListener('click', () => {
                currentStep--;
                showTutorialStep(tutorialSteps[currentStep]);
            });
        }
        
        if (currentStep < tutorialSteps.length - 1) {
            document.getElementById('nextTutorialStep').addEventListener('click', () => {
                currentStep++;
                showTutorialStep(tutorialSteps[currentStep]);
            });
        } else {
            document.getElementById('finishTutorial').addEventListener('click', () => {
                document.body.removeChild(tutorialOverlay);
                localStorage.setItem('tutorialComplete', 'true');
            });
        }
    }
    
    // Start with first step
    showTutorialStep(tutorialSteps[currentStep]);
}
