let gameID = 0;
let score = 0;
const n = 15;
const cell = 40;
const score_span = document.getElementById("score");
const canv_canvas = document.getElementById("myCanvas");
const cnt = document.getElementById("myCanvas").getContext("2d");
const button_input = document.querySelector(".button > input");
var snake = [];
var dir = 0;
var jabuka = Array(n).fill().map(() => Array(n));

function emptyCell() {
    cnt.clearRect(0, 0, canv_canvas.height, canv_canvas.width);
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if ((i + j) % 2 == 0) cnt.fillStyle = "#222222";
            else cnt.fillStyle = "#111111";
            cnt.fillRect(i * cell, j * cell, cell, cell);
            if (jabuka[i][j] === 1){
                cnt.fillStyle = "#A00000";
                cnt.fillRect(i * cell + 7, j * cell + 7, cell - 14, cell - 14);
            }
        }
    }
}

function drawConns(i, j, k, l) {
    cnt.fillStyle = "#1166CC";
    if (i === k - 1) cnt.fillRect((i+1) * cell - 5, j * cell + 5, 5, cell - 10);
    if (i === k + 1) cnt.fillRect(i * cell, j * cell + 5, 5, cell - 10);
    if (j === l - 1) cnt.fillRect(i * cell + 5, (j+1) * cell - 5, cell - 10, 5);
    if (j === l + 1) cnt.fillRect(i * cell + 5, j * cell, cell - 10, 5);
}

function drawSnake() {
    cnt.fillStyle = "#1166CC";

    for (var i = 0; i < snake.length; i++) {
        cnt.fillRect(snake[i].x * cell + 5, snake[i].y * cell + 5, cell - 10, cell - 10);
        if (i > 0) drawConns(snake[i].x, snake[i].y, snake[i-1].x, snake[i-1].y);
        if (i < snake.length - 1) drawConns(snake[i].x, snake[i].y, snake[i+1].x, snake[i+1].y);
    }

    cnt.fillStyle = "#6611CC";

    if (dir === 0 || dir === 1) cnt.fillRect(snake[0].x * cell + cell - 15, snake[0].y * cell + 10, 5, 5);
    if (dir === 1 || dir === 2) cnt.fillRect(snake[0].x * cell + cell - 15, snake[0].y * cell + cell - 15, 5, 5);
    if (dir === 2 || dir === 3) cnt.fillRect(snake[0].x * cell + 10, snake[0].y * cell + cell - 15, 5, 5);
    if (dir === 3 || dir === 0) cnt.fillRect(snake[0].x * cell + 10, snake[0].y * cell + 10, 5, 5);
}

function moveSnake() {
    for (var i = snake.length - 1; i > 0; i--) {
        snake[i] = { x: snake[i-1].x + 0, y: snake[i-1].y + 0 };            
    }

    if (dir === 0) snake[0].y--;
    if (dir === 1) snake[0].x++;
    if (dir === 2) snake[0].y++;
    if (dir === 3) snake[0].x--;
}

function jabukaSpawn() {

    let x = Math.floor(Math.random() * n);
    let y = Math.floor(Math.random() * n);

    let ok = 0;
    if (Math.floor(Math.random() * 8) === 0) ok = 1;
    for (var i = 0; i < snake.length; i++) {
        if (snake[i].x === x && snake[i].y === y) ok = 0;
    }

    if (ok === 1) {
        jabuka[x][y] = 1;
    }

}

function okej(x, y) {
    if (x < 0 || y < 0 || x >= n || y >= n) return 0;
    return 1;
}

function gameOver(ID) {
    if (ID != gameID) return 1;
    if (snake[0].x < 0 || snake[0].y < 0 || snake[0].x >= n || snake[0].y >= n) return 1;
    for (var i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return 1;
        }
    }
    return 0;
}

function move(ID) {

    if (gameOver(ID) === 1) {
        if (ID != gameID) return;
        cnt.font = "50px Montserrat";
        cnt.fillStyle = "white";
        cnt.textAlign = "center";
        cnt.fillText("Game Over", canv_canvas.height / 2, canv_canvas.width / 2);
        return;
    }

    let xn = snake[0].x;
    let yn = snake[0].y;

    if (dir === 0) yn--;
    if (dir === 1) xn++;
    if (dir === 2) yn++;
    if (dir === 3) xn--;

    if (okej(xn, yn) === 0){
        if (ID != gameID) return;
        cnt.font = "50px Montserrat";
        cnt.fillStyle = "white";
        cnt.textAlign = "center";
        cnt.fillText("Game Over", canv_canvas.height / 2, canv_canvas.width / 2);
        return;
    }

    for (var i = 1; i < snake.length; i++) {
        if (snake[i].x === xn && snake[i].y === yn) {
            if (ID != gameID) return;
            cnt.font = "50px Montserrat";
            cnt.fillStyle = "white";
            cnt.textAlign = "center";
            cnt.fillText("Game Over", canv_canvas.height / 2, canv_canvas.width / 2);
            return;
        }
    }

    setTimeout(() => { move(ID); }, Math.max(200, 750 - score*10));

    if (jabuka[xn][yn] === 0) moveSnake();
    else {
        score++;
        score_span.innerHTML = score;
        jabuka[xn][yn] = 0;
        snake.splice(0, 0, { x: xn, y: yn });
    }       

    emptyCell();
    drawSnake();
    jabukaSpawn();
}

function game() {

    snake.push({ x: Math.floor(Math.random() * (n-6)) + 3, y: Math.floor(Math.random() * (n-6)) + 3 });
    dir = Math.floor(Math.random() * 4);
    drawSnake();

    move(gameID);

}

function main() {
    button_input.addEventListener("click", () => {
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                jabuka[i][j] = 0;
            }
        }
        snake.splice(0, snake.length);
        emptyCell();
        gameID++;
        score = 0;
        score_span.innerHTML = score;
        game(); 
    })

    document.addEventListener("keyup", (e) => {
        if (e.code === "ArrowUp" || e.code === "KeyW") dir = 0;
        if (e.code === "ArrowRight" || e.code === "KeyD") dir = 1;
        if (e.code === "ArrowDown" || e.code === "KeyS") dir = 2;
        if (e.code === "ArrowLeft" || e.code === "KeyA") dir = 3;
    })
}

main();