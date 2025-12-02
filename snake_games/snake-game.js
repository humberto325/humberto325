// ========================================
// SNAKE GAME - JAVASCRIPT LOGIC
// ========================================

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Constants
const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;

// Game Variables
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = 0;
let level = 1;
let gameSpeed = 150;
let gameLoop = null;
let isPaused = false;
let isGameOver = false;

// Direction Queue (prevents quick double-tap bugs)
let directionQueue = [];

// Load High Score from localStorage
function loadHighScore() {
    const saved = localStorage.getItem('snakeHighScore');
    highScore = saved ? parseInt(saved) : 0;
    document.getElementById('highScore').textContent = highScore;
}

// Save High Score to localStorage
function saveHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
        return true;
    }
    return false;
}

// Initialize Game
function initGame() {
    loadHighScore();
    document.getElementById('startScreen').classList.add('active');
}

// Start Game
function startGame() {
    // Reset game state
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    level = 1;
    gameSpeed = 150;
    isPaused = false;
    isGameOver = false;
    directionQueue = [];
    
    // Update UI
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('startScreen').classList.remove('active');
    document.getElementById('gameOver').classList.remove('active');
    
    // Generate first food
    generateFood();
    
    // Start game loop
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
}

// Restart Game
function restartGame() {
    startGame();
}

// Toggle Pause
function togglePause() {
    if (isGameOver) return;
    
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (isPaused) {
        pauseBtn.textContent = '▶️ Reanudar';
        clearInterval(gameLoop);
    } else {
        pauseBtn.textContent = '⏸️ Pausar';
        gameLoop = setInterval(update, gameSpeed);
    }
}

// Generate Food
function generateFood() {
    let newFood;
    let isOnSnake;
    
    do {
        isOnSnake = false;
        newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
        
        // Check if food spawned on snake
        for (let segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                isOnSnake = true;
                break;
            }
        }
    } while (isOnSnake);
    
    food = newFood;
}

// Update Game State
function update() {
    if (isPaused || isGameOver) return;
    
    // Process direction queue
    if (directionQueue.length > 0) {
        const direction = directionQueue.shift();
        applyDirection(direction);
    }
    
    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Check wall collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        endGame();
        return;
    }
    
    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            endGame();
            return;
        }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        
        // Level up every 5 foods (50 points)
        if (score % 50 === 0) {
            levelUp();
        }
        
        generateFood();
        
        // Add visual feedback
        animateScoreIncrease();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
    
    // Draw everything
    draw();
}

// Level Up
function levelUp() {
    level++;
    document.getElementById('level').textContent = level;
    
    // Increase speed
    gameSpeed = Math.max(50, gameSpeed - 15);
    clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
    
    // Visual feedback
    animateLevelUp();
}

// Draw Game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= TILE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
    }
    
    // Draw food (apple)
    drawApple(food.x * GRID_SIZE, food.y * GRID_SIZE);
    
    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Head - brighter green
            ctx.fillStyle = '#4ade80';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#4ade80';
        } else {
            // Body - gradient green
            const opacity = 1 - (index / snake.length) * 0.3;
            ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#22c55e';
        }
        
        // Draw rounded rectangle
        drawRoundedRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2,
            4
        );
        
        // Add eyes to head
        if (index === 0) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#1a1a2e';
            
            // Determine eye position based on direction
            let eyeOffsetX = GRID_SIZE / 2;
            let eyeOffsetY = GRID_SIZE / 3;
            
            if (dx === 1) { // Moving right
                ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - 6, segment.y * GRID_SIZE + 5, 3, 3);
                ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - 6, segment.y * GRID_SIZE + 12, 3, 3);
            } else if (dx === -1) { // Moving left
                ctx.fillRect(segment.x * GRID_SIZE + 3, segment.y * GRID_SIZE + 5, 3, 3);
                ctx.fillRect(segment.x * GRID_SIZE + 3, segment.y * GRID_SIZE + 12, 3, 3);
            } else if (dy === 1) { // Moving down
                ctx.fillRect(segment.x * GRID_SIZE + 5, segment.y * GRID_SIZE + GRID_SIZE - 6, 3, 3);
                ctx.fillRect(segment.x * GRID_SIZE + 12, segment.y * GRID_SIZE + GRID_SIZE - 6, 3, 3);
            } else if (dy === -1) { // Moving up
                ctx.fillRect(segment.x * GRID_SIZE + 5, segment.y * GRID_SIZE + 3, 3, 3);
                ctx.fillRect(segment.x * GRID_SIZE + 12, segment.y * GRID_SIZE + 3, 3, 3);
            }
        }
    });
    
    // Reset shadow
    ctx.shadowBlur = 0;
}

// Draw Rounded Rectangle
function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

// Draw Apple
function drawApple(x, y) {
    // Apple body
    ctx.fillStyle = '#ef4444';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ef4444';
    ctx.beginPath();
    ctx.arc(x + GRID_SIZE / 2, y + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Apple highlight
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(x + GRID_SIZE / 2 - 2, y + GRID_SIZE / 2 - 2, GRID_SIZE / 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Stem
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(x + GRID_SIZE / 2 - 1, y + 2, 2, 4);
}

// Change Direction (for mobile controls)
function changeDirection(direction) {
    directionQueue.push(direction);
}

// Apply Direction from Queue
function applyDirection(direction) {
    switch (direction) {
        case 'UP':
            if (dy === 0) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'DOWN':
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'LEFT':
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'RIGHT':
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
            break;
    }
}

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    // Prevent default arrow key scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
    
    // Start game with space or enter
    if ((e.key === ' ' || e.key === 'Enter') && !gameLoop) {
        startGame();
        return;
    }
    
    // Pause with P or Space during game
    if (e.key === ' ' || e.key.toLowerCase() === 'p') {
        togglePause();
        return;
    }
    
    // Direction controls
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            directionQueue.push('UP');
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            directionQueue.push('DOWN');
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            directionQueue.push('LEFT');
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            directionQueue.push('RIGHT');
            break;
    }
});

// End Game
function endGame() {
    isGameOver = true;
    clearInterval(gameLoop);
    gameLoop = null;
    
    // Update final score
    document.getElementById('finalScore').textContent = score;
    
    // Check for new high score
    const isNewHighScore = saveHighScore();
    const highScoreMsg = document.getElementById('highScoreMsg');
    
    if (isNewHighScore) {
        highScoreMsg.textContent = '🎉 ¡Nuevo Récord! 🎉';
        highScoreMsg.style.display = 'block';
    } else {
        highScoreMsg.style.display = 'none';
    }
    
    // Show game over screen
    document.getElementById('gameOver').classList.add('active');
}

// Animate Score Increase
function animateScoreIncrease() {
    const scoreElement = document.getElementById('score');
    scoreElement.style.transform = 'scale(1.3)';
    scoreElement.style.color = '#4ade80';
    
    setTimeout(() => {
        scoreElement.style.transform = 'scale(1)';
        scoreElement.style.color = '#ffd700';
    }, 200);
}

// Animate Level Up
function animateLevelUp() {
    const levelElement = document.getElementById('level');
    levelElement.style.transform = 'scale(1.5)';
    levelElement.style.color = '#f093fb';
    
    setTimeout(() => {
        levelElement.style.transform = 'scale(1)';
        levelElement.style.color = '#ffd700';
    }, 300);
}

// Initialize game when page loads
window.addEventListener('load', initGame);
