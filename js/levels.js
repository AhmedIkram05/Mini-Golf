export const levels = [
  // Level 1 - Beginner's Course
  {
    startXPercent: 0.5, startYPercent: 0.9,
    holeXPercent: 0.5, holeYPercent: 0.1, 
    holeRadius: 15, holeColor: '#000000',
    par: 2,
    theme: {
      background: '#69b578', // Light green
      borderColor: '#2d6a4f'
    },
    obstacles: [
      { xPercent: 0.45, yPercent: 0.5, widthPercent: 0.1, heightPercent: 0.03, color: '#3f51b5' }
    ],
    sandBunkers: [
      { xPercent: 0.2, yPercent: 0.3, widthPercent: 0.15, heightPercent: 0.15, color: '#e6c986' }
    ]
  },
  
  // Level 2 - The Zigzag
  {
    startXPercent: 0.1, startYPercent: 0.8,
    holeXPercent: 0.9, holeYPercent: 0.2, 
    holeRadius: 15, holeColor: '#000000',
    par: 3,
    theme: {
      background: '#d8f3dc', // Sand color for a beach theme
      borderColor: '#40916c'
    },
    obstacles: [
      { xPercent: 0.2, yPercent: 0.4, widthPercent: 0.6, heightPercent: 0.03, color: '#ff5722' },
      { xPercent: 0.2, yPercent: 0.6, widthPercent: 0.6, heightPercent: 0.03, color: '#ff5722' }
    ]
  },
  
  // Level 3 - Water Challenge
  {
    startXPercent: 0.1, startYPercent: 0.85,
    holeXPercent: 0.9, holeYPercent: 0.15, 
    holeRadius: 15, holeColor: '#000000',
    par: 4,
    theme: {
      background: '#95d5b2', // Forest theme
      borderColor: '#1b4332'
    },
    obstacles: [
      { xPercent: 0.3, yPercent: 0.4, widthPercent: 0.4, heightPercent: 0.03, color: '#009688' },
      { xPercent: 0.1, yPercent: 0.7, widthPercent: 0.3, heightPercent: 0.03, color: '#009688' },
      { xPercent: 0.6, yPercent: 0.7, widthPercent: 0.3, heightPercent: 0.03, color: '#009688' }
    ],
    // Add more challenging water hazards
    waterHazards: [
      { xPercent: 0.45, yPercent: 0.2, widthPercent: 0.1, heightPercent: 0.1, color: 'rgba(0, 128, 255, 0.5)' },
      { xPercent: 0.45, yPercent: 0.5, widthPercent: 0.2, heightPercent: 0.1, color: 'rgba(0, 128, 255, 0.5)' }
    ]
  },
  
  // Level 4 - Long Distance Challenge
  {
    startXPercent: 0.05, startYPercent: 0.9,
    holeXPercent: 0.95, holeYPercent: 0.1, 
    holeRadius: 15, holeColor: '#000000',
    par: 5,
    theme: {
      background: '#f4a261', // Desert theme
      borderColor: '#e76f51'
    },
    obstacles: [
      { xPercent: 0.3, yPercent: 0.3, widthPercent: 0.05, heightPercent: 0.4, color: '#9c27b0' },
      { xPercent: 0.7, yPercent: 0.3, widthPercent: 0.05, heightPercent: 0.4, color: '#9c27b0' }
    ],
    sandBunkers: [
      { xPercent: 0.4, yPercent: 0.4, widthPercent: 0.2, heightPercent: 0.2, color: '#e6c986' }
    ]
  },
  
  // Level 5 - Maze Course - adjusted obstacles to work with original course size
  {
    startXPercent: 0.1, startYPercent: 0.92,
    holeXPercent: 0.9, holeYPercent: 0.08, 
    holeRadius: 15, holeColor: '#000000',
    par: 6,
    theme: {
      background: '#ffb703', // Sunset theme
      borderColor: '#fb8500'
    },
    obstacles: [
      // Vertical walls
      { xPercent: 0.2, yPercent: 0.2, widthPercent: 0.03, heightPercent: 0.6, color: '#ff9800' },
      { xPercent: 0.4, yPercent: 0.2, widthPercent: 0.03, heightPercent: 0.4, color: '#ff9800' },
      { xPercent: 0.6, yPercent: 0.4, widthPercent: 0.03, heightPercent: 0.4, color: '#ff9800' },
      { xPercent: 0.8, yPercent: 0.2, widthPercent: 0.03, heightPercent: 0.6, color: '#ff9800' },
      // Horizontal walls
      { xPercent: 0.2, yPercent: 0.2, widthPercent: 0.6, heightPercent: 0.03, color: '#ff9800' },
      { xPercent: 0.4, yPercent: 0.4, widthPercent: 0.2, heightPercent: 0.03, color: '#ff9800' },
      { xPercent: 0.2, yPercent: 0.6, widthPercent: 0.2, heightPercent: 0.03, color: '#ff9800' },
      { xPercent: 0.6, yPercent: 0.6, widthPercent: 0.2, heightPercent: 0.03, color: '#ff9800' },
      { xPercent: 0.2, yPercent: 0.8, widthPercent: 0.6, heightPercent: 0.03, color: '#ff9800' }
    ],
    // Add water hazards as additional challenges - adjusted to work with original course size
    waterHazards: [
      { xPercent: 0.3, yPercent: 0.3, widthPercent: 0.06, heightPercent: 0.06, color: 'rgba(0, 128, 255, 0.5)' },
      { xPercent: 0.7, yPercent: 0.7, widthPercent: 0.06, heightPercent: 0.06, color: 'rgba(0, 128, 255, 0.5)' }
    ]
  },
  
  // Level 6 - Night Golf - adjusted to work with original course size
  {
    startXPercent: 0.1, startYPercent: 0.88,
    holeXPercent: 0.9, holeYPercent: 0.12, 
    holeRadius: 15, holeColor: '#000000',
    par: 4,
    theme: {
      background: '#023047', // Night theme
      borderColor: '#219ebc'
    },
    obstacles: [
      { xPercent: 0.25, yPercent: 0.3, widthPercent: 0.5, heightPercent: 0.03, color: '#607d8b' },
      { xPercent: 0.25, yPercent: 0.7, widthPercent: 0.5, heightPercent: 0.03, color: '#607d8b' },
      { xPercent: 0.25, yPercent: 0.3, widthPercent: 0.03, heightPercent: 0.4, color: '#607d8b' },
      { xPercent: 0.75, yPercent: 0.3, widthPercent: 0.03, heightPercent: 0.4, color: '#607d8b' }
    ],
    sandBunkers: [
      { xPercent: 0.4, yPercent: 0.45, widthPercent: 0.2, heightPercent: 0.1, color: '#e6c986' }
    ]
  },
  
  // Level 7 - Pinball Style - adjusted for original course size
  {
    startXPercent: 0.5, startYPercent: 0.9,
    holeXPercent: 0.5, holeYPercent: 0.1, 
    holeRadius: 15, holeColor: '#000000',
    par: 3,
    theme: {
      background: '#ffadad', // Candy theme
      borderColor: '#ff6392'
    },
    obstacles: [
      // Bumpers as small square obstacles
      { xPercent: 0.3, yPercent: 0.2, widthPercent: 0.06, heightPercent: 0.06, color: '#e91e63' },
      { xPercent: 0.7, yPercent: 0.2, widthPercent: 0.06, heightPercent: 0.06, color: '#e91e63' },
      { xPercent: 0.2, yPercent: 0.4, widthPercent: 0.06, heightPercent: 0.06, color: '#e91e63' },
      { xPercent: 0.8, yPercent: 0.4, widthPercent: 0.06, heightPercent: 0.06, color: '#e91e63' },
      { xPercent: 0.3, yPercent: 0.6, widthPercent: 0.06, heightPercent: 0.06, color: '#e91e63' },
      { xPercent: 0.7, yPercent: 0.6, widthPercent: 0.06, heightPercent: 0.06, color: '#e91e63' },
      { xPercent: 0.5, yPercent: 0.5, widthPercent: 0.06, heightPercent: 0.06, color: '#e91e63' }
    ]
  },
  
  // Level 8 - Island Green - adjusted for original course size
  {
    startXPercent: 0.5, startYPercent: 0.85,
    holeXPercent: 0.5, holeYPercent: 0.15, 
    holeRadius: 15, holeColor: '#000000',
    par: 5,
    theme: {
      background: '#a8dadc', // Ocean theme
      borderColor: '#457b9d'
    },
    obstacles: [
      { xPercent: 0.1, yPercent: 0.5, widthPercent: 0.06, heightPercent: 0.3, color: '#4caf50' },
      { xPercent: 0.85, yPercent: 0.5, widthPercent: 0.06, heightPercent: 0.3, color: '#4caf50' }
    ],
    // Create an island green surrounded by water
    waterHazards: [
      { xPercent: 0.3, yPercent: 0.05, widthPercent: 0.4, heightPercent: 0.25, color: 'rgba(0, 128, 255, 0.6)' },
      { xPercent: 0.15, yPercent: 0.05, widthPercent: 0.15, heightPercent: 0.9, color: 'rgba(0, 128, 255, 0.6)' },
      { xPercent: 0.7, yPercent: 0.05, widthPercent: 0.15, heightPercent: 0.9, color: 'rgba(0, 128, 255, 0.6)' }
    ],
    sandBunkers: [
      { xPercent: 0.45, yPercent: 0.35, widthPercent: 0.1, heightPercent: 0.1, color: '#e6c986' }
    ]
  },
  
  // Level 9 - Crossroads - adjusted for original course size
  {
    startXPercent: 0.95, startYPercent: 0.95,
    holeXPercent: 0.05, holeYPercent: 0.05, 
    holeRadius: 15, holeColor: '#000000',
    par: 4,
    theme: {
      background: '#ffddd2', // Pastel theme
      borderColor: '#e29578'
    },
    obstacles: [
      // Create a cross in the middle
      { xPercent: 0.48, yPercent: 0.1, widthPercent: 0.04, heightPercent: 0.8, color: '#795548' },
      { xPercent: 0.1, yPercent: 0.48, widthPercent: 0.8, heightPercent: 0.04, color: '#795548' }
    ],
    waterHazards: [
      { xPercent: 0.1, yPercent: 0.1, widthPercent: 0.15, heightPercent: 0.15, color: 'rgba(0, 128, 255, 0.5)' },
      { xPercent: 0.75, yPercent: 0.75, widthPercent: 0.15, heightPercent: 0.15, color: 'rgba(0, 128, 255, 0.5)' }
    ],
    sandBunkers: [
      { xPercent: 0.75, yPercent: 0.1, widthPercent: 0.15, heightPercent: 0.15, color: '#e6c986' },
      { xPercent: 0.1, yPercent: 0.75, widthPercent: 0.15, heightPercent: 0.15, color: '#e6c986' }
    ]
  },
  
  // Level 10 - The Gauntlet - adjusted for original course size
  {
    startXPercent: 0.5, startYPercent: 0.95,
    holeXPercent: 0.5, holeYPercent: 0.05, 
    holeRadius: 15, holeColor: '#000000',
    par: 6,
    theme: {
      background: '#e9c46a', // Autumn theme
      borderColor: '#f4a261'
    },
    obstacles: [
      // Create a narrow path with obstacles on both sides
      { xPercent: 0.1, yPercent: 0.2, widthPercent: 0.35, heightPercent: 0.03, color: '#8bc34a' },
      { xPercent: 0.55, yPercent: 0.2, widthPercent: 0.35, heightPercent: 0.03, color: '#8bc34a' },
      { xPercent: 0.1, yPercent: 0.4, widthPercent: 0.35, heightPercent: 0.03, color: '#8bc34a' },
      { xPercent: 0.55, yPercent: 0.4, widthPercent: 0.35, heightPercent: 0.03, color: '#8bc34a' },
      { xPercent: 0.1, yPercent: 0.6, widthPercent: 0.35, heightPercent: 0.03, color: '#8bc34a' },
      { xPercent: 0.55, yPercent: 0.6, widthPercent: 0.35, heightPercent: 0.03, color: '#8bc34a' },
      { xPercent: 0.1, yPercent: 0.8, widthPercent: 0.35, heightPercent: 0.03, color: '#8bc34a' },
      { xPercent: 0.55, yPercent: 0.8, widthPercent: 0.35, heightPercent: 0.03, color: '#8bc34a' }
    ],
    waterHazards: [
      { xPercent: 0.1, yPercent: 0.3, widthPercent: 0.06, heightPercent: 0.06, color: 'rgba(0, 128, 255, 0.5)' },
      { xPercent: 0.85, yPercent: 0.3, widthPercent: 0.06, heightPercent: 0.06, color: 'rgba(0, 128, 255, 0.5)' },
      { xPercent: 0.1, yPercent: 0.7, widthPercent: 0.06, heightPercent: 0.06, color: 'rgba(0, 128, 255, 0.5)' },
      { xPercent: 0.85, yPercent: 0.7, widthPercent: 0.06, heightPercent: 0.06, color: 'rgba(0, 128, 255, 0.5)' }
    ],
    sandBunkers: [
      { xPercent: 0.45, yPercent: 0.3, widthPercent: 0.1, heightPercent: 0.4, color: '#e6c986' }
    ]
  }
];
