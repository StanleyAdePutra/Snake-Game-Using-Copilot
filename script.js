const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = {
  x: getRandomInt(0, canvasSize / gridSize) * gridSize,
  y: getRandomInt(0, canvasSize / gridSize) * gridSize,
};
let score = 0;
let updateInterval = 150; // milliseconds
const minInterval = 50; // minimum interval
let canChangeDirection = true;

let scoreElement = document.getElementById("score");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (!canChangeDirection) return;
  const keyCode = event.keyCode;
  if (keyCode === 37 && direction.x === 0) {
    direction = { x: -gridSize, y: 0 };
  } else if (keyCode === 38 && direction.y === 0) {
    direction = { x: 0, y: -gridSize };
  } else if (keyCode === 39 && direction.x === 0) {
    direction = { x: gridSize, y: 0 };
  } else if (keyCode === 40 && direction.y === 0) {
    direction = { x: 0, y: gridSize };
  }
  canChangeDirection = false;
}

function updateScore() {
  scoreElement.textContent = "Score: " + score;
}

function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (
    Math.abs(head.x - food.x) < gridSize &&
    Math.abs(head.y - food.y) < gridSize
  ) {
    score++;
    updateScore();
    food = {
      x: getRandomInt(0, canvasSize / gridSize) * gridSize,
      y: getRandomInt(0, canvasSize / gridSize) * gridSize,
    };
    updateInterval = Math.max(minInterval, updateInterval - 5); // decrease interval
  } else {
    snake.pop();
  }

  if (
    head.x < 0 ||
    head.x >= canvasSize ||
    head.y < 0 ||
    head.y >= canvasSize ||
    isCollision(head)
  ) {
    resetGame();
    return;
  }

  snake.unshift(head);

  draw();
  canChangeDirection = true;
  setTimeout(update, updateInterval);
}

function isCollision(head) {
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      return true;
    }
  }
  return false;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  for (let segment of snake) {
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function resetGame() {
  snake = [{ x: 200, y: 200 }];
  direction = { x: 0, y: 0 };
  food = {
    x: getRandomInt(0, canvasSize / gridSize) * gridSize,
    y: getRandomInt(0, canvasSize / gridSize) * gridSize,
  };
  score = 0;
  updateScore();
  updateInterval = 150; // reset interval
  canChangeDirection = true;
  setTimeout(update, updateInterval);
}

setTimeout(update, updateInterval);
