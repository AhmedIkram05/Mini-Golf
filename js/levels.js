export const levels = [
  // Level 1
  {
    startXPercent: 0.5, startYPercent: 0.9,
    holeXPercent: 0.5, holeYPercent: 0.1, 
    holeRadius: 15, holeColor: '#000000',
    par: 1,
    theme: {
      background: '#69b578', // Light green
      borderColor: '#2d6a4f'
    },
    obstacles: [
      { xPercent: 0.45, yPercent: 0.5, widthPercent: 0.1, heightPercent: 0.02, color: '#3f51b5' }
    ]
  },
  // Level 2
  {
    startXPercent: 0.2, startYPercent: 0.8,
    holeXPercent: 0.8, holeYPercent: 0.2, 
    holeRadius: 15, holeColor: '#000000',
    par: 1,
    theme: {
      background: '#d8f3dc', // Sand color for a beach theme
      borderColor: '#40916c'
    },
    obstacles: [
      { xPercent: 0.0, yPercent: 0.4, widthPercent: 0.25, heightPercent: 0.03, color: '#ff5722' },
      { xPercent: 0.75, yPercent: 0.6, widthPercent: 0.2, heightPercent: 0.03, color: '#ff5722' }
    ]
  },
  // Level 3 - Adding water hazard to make this level more challenging
  {
    startXPercent: 0.5, startYPercent: 0.85,
    holeXPercent: 0.5, holeYPercent: 0.15, 
    holeRadius: 15, holeColor: '#000000',
    par: 2,
    theme: {
      background: '#95d5b2', // Forest theme
      borderColor: '#1b4332'
    },
    obstacles: [
      { xPercent: 0.3, yPercent: 0.4, widthPercent: 0.4, heightPercent: 0.02, color: '#009688' },
      { xPercent: 0.0, yPercent: 0.7, widthPercent: 0.2, heightPercent: 0.02, color: '#009688' },
      { xPercent: 0.8, yPercent: 0.7, widthPercent: 0.15, heightPercent: 0.02, color: '#009688' }
    ],
    // Add a small water hazard
    waterHazards: [
      { xPercent: 0.45, yPercent: 0.2, widthPercent: 0.1, heightPercent: 0.1, color: 'rgba(0, 128, 255, 0.5)' }
    ]
  },
  // Level 4
  {
    startXPercent: 0.8, startYPercent: 0.9,
    holeXPercent: 0.2, holeYPercent: 0.15, 
    holeRadius: 15, holeColor: '#000000',
    par: 2,
    theme: {
      background: '#f4a261', // Desert theme
      borderColor: '#e76f51'
    },
    obstacles: [
      { xPercent: 0.4, yPercent: 0.3, widthPercent: 0.15, heightPercent: 0.4, color: '#9c27b0' }
    ]
  },
  // Level 5 - Add water hazards to make this long par 5 more challenging
  {
    startXPercent: 0.1, startYPercent: 0.92,
    holeXPercent: 0.9, holeYPercent: 0.08, 
    holeRadius: 15, holeColor: '#000000',
    par: 5,
    theme: {
      background: '#ffb703', // Sunset theme
      borderColor: '#fb8500'
    },
    obstacles: [
      { xPercent: 0.3, yPercent: 0.3, widthPercent: 0.4, heightPercent: 0.02, color: '#ff9800' },
      { xPercent: 0.3, yPercent: 0.75, widthPercent: 0.4, heightPercent: 0.02, color: '#ff9800' }
    ],
    // Add water hazards along the path
    waterHazards: [
      { xPercent: 0.15, yPercent: 0.45, widthPercent: 0.1, heightPercent: 0.2, color: 'rgba(0, 128, 255, 0.5)' },
      { xPercent: 0.75, yPercent: 0.35, widthPercent: 0.12, heightPercent: 0.15, color: 'rgba(0, 128, 255, 0.5)' }
    ]
  },
  // Level 6
  {
    startXPercent: 0.6, startYPercent: 0.88,
    holeXPercent: 0.6, holeYPercent: 0.12, 
    holeRadius: 15, holeColor: '#000000',
    par: 2,
    theme: {
      background: '#023047', // Night theme
      borderColor: '#219ebc'
    },
    obstacles: [
      { xPercent: 0.2, yPercent: 0.5, widthPercent: 0.2, heightPercent: 0.02, color: '#607d8b' },
      { xPercent: 0.65, yPercent: 0.4, widthPercent: 0.18, heightPercent: 0.02, color: '#607d8b' }
    ]
  },
  // Level 7
  {
    startXPercent: 0.3, startYPercent: 0.83,
    holeXPercent: 0.7, holeYPercent: 0.17, 
    holeRadius: 15, holeColor: '#000000',
    par: 1,
    theme: {
      background: '#ffadad', // Candy theme
      borderColor: '#ff6392'
    },
    obstacles: [
      { xPercent: 0.5, yPercent: 0.25, widthPercent: 0.3, heightPercent: 0.02, color: '#e91e63' },
      { xPercent: 0.5, yPercent: 0.55, widthPercent: 0.3, heightPercent: 0.02, color: '#e91e63' }
    ]
  },
  // Level 8 - Ocean themed, so add water obstacles
  {
    startXPercent: 0.5, startYPercent: 0.9,
    holeXPercent: 0.5, holeYPercent: 0.1, 
    holeRadius: 15, holeColor: '#000000',
    par: 3,
    theme: {
      background: '#a8dadc', // Ocean theme
      borderColor: '#457b9d'
    },
    obstacles: [
      { xPercent: 0.1, yPercent: 0.5, widthPercent: 0.25, heightPercent: 0.03, color: '#4caf50' },
      { xPercent: 0.65, yPercent: 0.5, widthPercent: 0.25, heightPercent: 0.03, color: '#4caf50' }
    ],
    // Add water hazards to match the ocean theme
    waterHazards: [
      { xPercent: 0.4, yPercent: 0.3, widthPercent: 0.2, heightPercent: 0.1, color: 'rgba(0, 128, 255, 0.6)' },
      { xPercent: 0.4, yPercent: 0.7, widthPercent: 0.2, heightPercent: 0.1, color: 'rgba(0, 128, 255, 0.6)' }
    ]
  },
  // Level 9
  {
    startXPercent: 0.9, startYPercent: 0.85,
    holeXPercent: 0.1, holeYPercent: 0.15, 
    holeRadius: 15, holeColor: '#000000',
    par: 1,
    theme: {
      background: '#ffddd2', // Pastel theme
      borderColor: '#e29578'
    },
    obstacles: [
      { xPercent: 0.4, yPercent: 0.4, widthPercent: 0.2, heightPercent: 0.02, color: '#795548' },
      { xPercent: 0.4, yPercent: 0.65, widthPercent: 0.2, heightPercent: 0.02, color: '#795548' }
    ]
  },
  // Level 10 - The final regular level should be challenging
  {
    startXPercent: 0.5, startYPercent: 0.95,
    holeXPercent: 0.5, holeYPercent: 0.05, 
    holeRadius: 15, holeColor: '#000000',
    par: 2,
    theme: {
      background: '#e9c46a', // Autumn theme
      borderColor: '#f4a261'
    },
    obstacles: [
      { xPercent: 0.2, yPercent: 0.5, widthPercent: 0.6, heightPercent: 0.02, color: '#8bc34a' },
      { xPercent: 0.2, yPercent: 0.7, widthPercent: 0.6, heightPercent: 0.02, color: '#8bc34a' }
    ],
    // Add small water hazards to make the level more challenging
    waterHazards: [
      { xPercent: 0.45, yPercent: 0.3, widthPercent: 0.1, heightPercent: 0.05, color: 'rgba(0, 128, 255, 0.5)' }
    ]
  },
  // Level 11 - Water hazard example
  {
    startXPercent: 0.2, startYPercent: 0.8,
    holeXPercent: 0.8, holeYPercent: 0.2, 
    holeRadius: 15, holeColor: '#000000',
    par: 3,
    theme: {
      background: '#8ecae6', // Light blue theme
      borderColor: '#023e8a'
    },
    obstacles: [
      { xPercent: 0.45, yPercent: 0.45, widthPercent: 0.1, heightPercent: 0.2, color: '#14213d' }
    ],
    waterHazards: [
      { xPercent: 0.35, yPercent: 0.35, widthPercent: 0.3, heightPercent: 0.1, color: 'rgba(0, 128, 255, 0.5)' }
    ]
  }
];
