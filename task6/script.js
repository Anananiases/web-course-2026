(() => {
  'use strict';

  const CONFIG = Object.freeze({
    canvasSize: 600,
    gridSize: 20,
    cellSize: 30,
    initialLength: 3,
    moveIntervalMs: 140,
    colors: Object.freeze({
      background: '#0b1220',
      grid: '#111c2e',
      snakeHead: '#22c55e',
      snakeBody: '#16a34a',
      apple: '#ef4444',
    }),
  });

  const DIRECTIONS = Object.freeze({
    up:    Object.freeze({ x: 0,  y: -1 }),
    down:  Object.freeze({ x: 0,  y: 1  }),
    left:  Object.freeze({ x: -1, y: 0  }),
    right: Object.freeze({ x: 1,  y: 0  }),
  });

  
  class SnakeModel {
    constructor(config) {
      this.config = config;
      this.reset();
    }

    reset() {
      const center = Math.floor(this.config.gridSize / 2);
      this.snake = [
        { x: center,     y: center },
        { x: center - 1, y: center },
        { x: center - 2, y: center },
      ];
      this.direction = DIRECTIONS.right;
      this.pendingDirection = DIRECTIONS.right;
      this.score = 0;
      this.gameOver = false;
      this.apple = null;
    }
  }

  function init() {
    const model = new SnakeModel(CONFIG);
    console.log('Model state:', model.snake, model.direction);
  }

  document.addEventListener('DOMContentLoaded', init);
})();