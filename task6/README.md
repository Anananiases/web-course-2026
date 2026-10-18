# Змейка на Canvas (MVC)

## Архитектура
- **Model** (`SnakeModel`) — состояние и логика: массив сегментов, направление, яблоко, счёт, `gameOver`. Методы: `step()`, `spawnApple()`, `setDirection()`, `reset()`, коллизии.
- **View** (`SnakeView`) — только отрисовка: `render(model)`, `drawGrid()`, `drawSnake()`, `drawApple()`, `updateScore()`, `showGameOver()`, `hideGameOver()`.
- **Controller** (`SnakeController`) — цикл `requestAnimationFrame`, ввод клавиатуры, `restart()`, `stopLoop()`, `update()`.

## Ключевые моменты
- Все переменные внутри IIFE — глобальных нет.
- Скорость независима от FPS: движение по `deltaTime >= moveIntervalMs`.
- `update()` и `draw()` разделены.
- Защита от разворота на 180° через `pendingDirection`.
- `restart()` отменяет старый `requestAnimationFrame` — нет «зависших» циклов.

## Запуск
Открыть `index.html` в браузере.