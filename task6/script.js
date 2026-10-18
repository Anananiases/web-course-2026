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

  // ============================================================
  // VIEW — только отрисовка
  // ============================================================
  class SnakeView {
    constructor(canvas, config, dom) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.config = config;
      this.dom = dom;
      this.resizeCanvas();
    }

    resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      const cssSize = this.canvas.clientWidth || this.config.canvasSize;
      this.canvas.width = cssSize * dpr;
      this.canvas.height = cssSize * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.scale = cssSize / this.config.canvasSize;
      this.cell = (this.config.canvasSize / this.config.gridSize) * this.scale;
    }

    clear() {
      this.ctx.fillStyle = this.config.colors.background;
      this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
      this.drawGrid();
    }

    drawGrid() {
      const { gridSize } = this.config;
      this.ctx.strokeStyle = this.config.colors.grid;
      this.ctx.lineWidth = 1;
      for (let i = 1; i < gridSize; i++) {
        const pos = i * this.cell;
        this.ctx.beginPath();
        this.ctx.moveTo(pos, 0);
        this.ctx.lineTo(pos, gridSize * this.cell);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(0, pos);
        this.ctx.lineTo(gridSize * this.cell, pos);
        this.ctx.stroke();
      }
    }

    drawApple(apple) {
      if (!apple) return;
      const { cell } = this;
      const cx = apple.x * cell + cell / 2;
      const cy = apple.y * cell + cell / 2;
      const r = cell * 0.36;

      this.ctx.fillStyle = this.config.colors.apple;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
      this.ctx.fill();
    }
        drawSnake(snake) {
      const { cell } = this;
      const radius = cell * 0.22;

      snake.forEach((segment, index) => {
        const isHead = index === 0;
        this.ctx.fillStyle = isHead
          ? this.config.colors.snakeHead
          : this.config.colors.snakeBody;

        const x = segment.x * cell + 1;
        const y = segment.y * cell + 1;
        const w = cell - 2;
        const h = cell - 2;

        this.roundRect(x, y, w, h, radius);
        this.ctx.fill();
      });
    }

    roundRect(x, y, w, h, r) {
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    render(model) {
      this.clear();
      this.drawApple(model.apple);
      this.drawSnake(model.snake);
    }
  }

    function init() {
    const canvas = document.getElementById('game');
    if (!canvas) return;
    const model = new SnakeModel(CONFIG);
    const view = new SnakeView(canvas, CONFIG, {});
    view.render(model);
  }

  document.addEventListener('DOMContentLoaded', init);
})();