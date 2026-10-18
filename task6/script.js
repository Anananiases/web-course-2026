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
      this.apple = this.spawnApple();
    }

    spawnApple() {
      const { gridSize } = this.config;
      const occupied = new Set(this.snake.map(s => `${s.x},${s.y}`));
      const free = [];

      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          if (!occupied.has(`${x},${y}`)) free.push({ x, y });
        }
      }

      if (free.length === 0) return null;
      return free[Math.floor(Math.random() * free.length)];
    }

    setDirection(nextDirection) {
      const opposite = (a, b) => a.x + b.x === 0 && a.y + b.y === 0;
      if (opposite(nextDirection, this.direction)) return false;
      this.pendingDirection = nextDirection;
      return true;
    }

    step() {
      if (this.gameOver) return 'dead';

      this.direction = this.pendingDirection;
      const head = this.snake[0];
      const nextHead = {
        x: head.x + this.direction.x,
        y: head.y + this.direction.y,
      };

      if (this.isOutOfBounds(nextHead) || this.isOnTail(nextHead)) {
        this.gameOver = true;
        return 'dead';
      }

      this.snake.unshift(nextHead);

      const ate = this.apple && nextHead.x === this.apple.x && nextHead.y === this.apple.y;
      if (ate) {
        this.score += 1;
        this.apple = this.spawnApple();
      } else {
        this.snake.pop();
      }

      return ate ? 'ate' : 'moved';
    }

    isOutOfBounds(cell) {
      const { gridSize } = this.config;
      return cell.x < 0 || cell.y < 0 || cell.x >= gridSize || cell.y >= gridSize;
    }

    isOnTail(cell) {
      for (let i = 0; i < this.snake.length - 1; i++) {
        const s = this.snake[i];
        if (s.x === cell.x && s.y === cell.y) return true;
      }
      return false;
    }
  }
  
  function init() {
    const model = new SnakeModel(CONFIG);
    console.log('Model state:', model.snake, model.direction);
  }

  document.addEventListener('DOMContentLoaded', init);
})();