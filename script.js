const rulesButton = document.getElementById("rules-btn");
const closeButton = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Obtener colores desde CSS
const color = getComputedStyle(document.documentElement).getPropertyValue(
  "--button-color"
);
const secondaryColor = getComputedStyle(
  document.documentElement
).getPropertyValue("--sidebar-color");

// Configuración inicial
let score = 0;
const brickRowCount = 9;
const brickColumnCount = 5;

// Ajustar el canvas
const heightRatio = 0.75;
canvas.width = 800;
canvas.height = canvas.width * heightRatio;

// Elementos del juego
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 6,
  dx: 4,
  dy: -4,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

// Crear los ladrillos
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x =
      i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y =
      j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Dibujar la bola
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

// Dibujar la paleta
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

// Dibujar los ladrillos
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
      }
    });
  });
}

// Dibujar la puntuación
function drawScore() {
  ctx.font = "20px Balsamiq Sans";
  ctx.fillStyle = secondaryColor;
  ctx.fillText(`Puntaje: ${score}`, canvas.width - 100, 30);
}

// Mover la paleta
function movePaddle() {
  paddle.x += paddle.dx;

  // Limitar el movimiento dentro del canvas
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
}

// Mover la bola
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Rebotar en las paredes
  if (ball.x - ball.size < 0 || ball.x + ball.size > canvas.width) {
    ball.dx *= -1;
  }

  if (ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // Perder la partida si la bola toca la parte inferior
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }

  // Rebotar en la paleta
  if (
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Colisión con ladrillos
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y - ball.size < brick.y + brick.h &&
          ball.y + ball.size > brick.y
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });
}

// Incrementar puntuación
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColumnCount) === 0) {
    showAllBricks();
  }
}

// Mostrar todos los ladrillos
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

// Manejar eventos de teclado
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

// Actualizar el canvas
function update() {
  movePaddle();
  moveBall();

  // Limpiar y redibujar
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();

  requestAnimationFrame(update);
}

// Event Listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
rulesButton.addEventListener("click", () => rules.classList.add("show"));
closeButton.addEventListener("click", () => rules.classList.remove("show"));

// Iniciar el juego
update();
