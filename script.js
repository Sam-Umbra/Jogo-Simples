// Configs Gerais
const canvas = document.getElementById('myCanvas');
const render = canvas.getContext('2d');
let interval = 0;
const ballColor = "#00BFFF";
const paddleColor = "#1A1A1A";
const scoreColor = "#1A1A1A";
const livesColor = "#FF4136";
let brickColor = getRandomColor();

// Bola
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2; // Velocidade de movimento da bola (Pixeis)
let dy = -2;
const ballRadius = 10;
function drawBall() {
    // Começa a pintura
    render.beginPath();

    // Cria o formato da bola:
    // Cordenadas(x , y)
    // Radius da Curva (ballRadius)
    // Primeiro/Último angulo da bola (0, Math.PI * 2)
    render.arc(x, y , ballRadius, 0, Math.PI * 2);

    // Cor para a Bola
    render.fillStyle = ballColor;
    
    // Pinta o Canvas
    render.fill();

    // Termina a pintura
    render.closePath();
}

// Plataforma
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2; // Determina sua posição em X
let rightPressed = false;
let leftPressed = false;
function drawPaddle() {
    render.beginPath();
    render.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    render.fillStyle = paddleColor;
    render.fill();
    render.closePath();
}

// Blocos
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            // Se o status do objeto for 1, desenha
            // Se for 0, o objeto é apagado
            if (bricks[c][r].status === 1) {
                // Ajusta a posição de cada bloco em relação a sua posição no array
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                // Customiza cada bloco com uma cor aleatória
                if (!bricks[c][r].color) {
                    bricks[c][r].color = getRandomColor();
                }
                render.beginPath();
                render.rect(brickX, brickY, brickWidth, brickHeight);
                render.fillStyle = bricks[c][r].color;
                render.fill();
                render.closePath();
            }
        }
    }
}

// Pontuação
let score = 0;
function drawScore() {
    render.font = "20px Roboto";
    render.fillStyle = scoreColor;
    render.fillText(`Pontos: ${score}`, 9, 20);
}

// Vidas
let lives = 3;
function drawLives() {
    render.font = "20px Roboto";
    render.fillStyle = livesColor;
    render.fillText(`Vidas: ${lives}`, canvas.width - 75, 20);
}

function draw() {
    // Apaga a pintura anterior
    // garante que a os objetos em movimento não deixem rastro
    render.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    x += dx;
    y += dy;
    
    // Colisão com cima e baixo do Canvas
    // Bola(y) < 0 - Inverte o movimento em Y
    // 0 === Top; Canvas.height === Bottom;
    if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius) {
        // Colisão Bola e Plataforma
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else { // GAME OVER
            lives--; // Perdeu as vidas - GAME OVER
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                // Acertou o chão do canvas = -Vida e Reseta as posições
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    // Mesma coisa só que para Esquerda e Direita
    // Colisão na borda (radius) e não no centro
    // 0 === Left; Canvas.width === Right
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    // Controla o desenho da plataforma
    if (rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
      } else if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
    }

    requestAnimationFrame(draw);
}

function startGame() {
    // Controle do input das setas do user:
    // User segura/clica na tecla
    document.addEventListener('keyup', keyUpHandler, false);
    // User solta a tecla
    document.addEventListener('keydown', keyDownHandler, false);

    document.addEventListener('mousemove', mouseMoveHandler, false);

    draw();
}

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("VOCÊ GANHOU!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}  

document.getElementById('runButton').addEventListener('click', () => {
    startGame();
})

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
