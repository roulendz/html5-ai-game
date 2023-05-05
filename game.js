// Get the canvas element and its context
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Define some game constants
var FPS = 30; // Frames per second
// Set the canvas width and height
var width = 800;
var height = 600;

// Define some constants for the game
var GRAVITY = 0.5; // The gravity force that pulls the player down
var FRICTION = 0.8; // The friction force that slows down the player horizontally
var JUMP_SPEED = -10; // The initial vertical speed when the player jumps
var MOVE_SPEED = 5; // The horizontal speed when the player moves left or right
var SCROLL_SPEED = 2; // The speed at which the background scrolls
var PLAYER_SIZE = 20; // The size of the player box
var ENEMY_SIZE = 20; // The size of the enemy box
var OBSTACLE_SIZE = 40; // The size of the obstacle box

// Define some variables for the game state
var lastRender = 0; // The timestamp of the last render
var gameOver = false; // Whether the game is over or not
var score = 0; // The current score of the game
var scrollX = 0; // The current scroll position of the background
var playerX = width / 2; // The current x position of the player
var playerY = height - PLAYER_SIZE; // The current y position of the player
var playerVX = 0; // The current horizontal velocity of the player
var playerVY = 0; // The current vertical velocity of the player
var jumping = false; // Whether the player is jumping or not
var enemies = []; // An array of enemies objects
var obstacles = []; // An array of obstacles objects

// Define some colors for the game elements
var backgroundColor = "lightblue";
var groundColor = "green";
var playerColor = "blue";
var enemyColor = "red";
var obstacleColor = "brown";

// Add an event listener for keydown events
window.addEventListener("keydown", function(event) {
  // Check which key was pressed
  switch (event.keyCode) {
    case 37: // Left arrow key
      // Move the player to the left
      playerVX = -MOVE_SPEED;
      break;
    case 39: // Right arrow key
      // Move the player to the right
      playerVX = MOVE_SPEED;
      break;
    case 32: // Spacebar key
      // Make the player jump if not already jumping
      if (!jumping) {
        jumping = true;
        playerVY = JUMP_SPEED;
      }
      break;
  }
});

// Add an event listener for keyup events
window.addEventListener("keyup", function(event) {
  // Check which key was released
  switch (event.keyCode) {
    case 37: // Left arrow key
    case 39: // Right arrow key
      // Stop moving the player horizontally
      playerVX = 0;
      break;
    case 32: // Spacebar key
      // Stop jumping if the player is going up
      if (playerVY < 0) {
        playerVY = 0;
      }
      break;
  }
});

// Define a function to update the game state based on elapsed time since last render
function update(progress) {
  // Update the score based on progress
  score += progress;

  // Update the scroll position based on scroll speed and progress
  scrollX += SCROLL_SPEED * progress;

  // Update the player position based on velocity and progress
  playerX += playerVX * progress;
  playerY += playerVY * progress;

  // Apply gravity to the player vertical velocity
  playerVY += GRAVITY * progress;

  // Apply friction to the player horizontal velocity
  if (playerVX > 0) {
    playerVX -= FRICTION * progress;
    if (playerVX < 0) {
      playerVX = 0;
    }
  } else if (playerVX < 0) {
    playerVX += FRICTION * progress;
    if (playerVX > 0) {
      playerVX = 0;
    }
  }

  // Check if the player is on the ground
  if (playerY + PLAYER_SIZE >= height) {
    // Set the player position and velocity to the ground level
    playerY = height - PLAYER_SIZE;
    playerVY = 0;
    jumping = false;
  }

  // Check if the player is out of the canvas horizontally
  if (playerX + PLAYER_SIZE < 0 || playerX > width) {
    // Game over
    gameOver = true;
  }

  // Generate a new enemy every second on average
  if (Math.random() < progress / 1000) {
    // Create a new enemy object with random x position and fixed y position
    var enemy = {
      x: Math.random() * width,
      y: height - ENEMY_SIZE,
    };
    // Add the enemy to the enemies array
    enemies.push(enemy);
  }

  // Generate a new obstacle every two seconds on average
  if (Math.random() < progress / 2000) {
    // Create a new obstacle object with random x position and fixed y position
    var obstacle = {
      x: Math.random() * width,
      y: height - OBSTACLE_SIZE,
    };
    // Add the obstacle to the obstacles array
    obstacles.push(obstacle);
  }

  // Update the enemies positions based on scroll speed and progress
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].x -= SCROLL_SPEED * progress;
  }

  // Update the obstacles positions based on scroll speed and progress
  for (var i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= SCROLL_SPEED * progress;
  }

  // Check for collisions between the player and the enemies or obstacles
  for (var i = 0; i < enemies.length; i++) {
    if (
      playerX + PLAYER_SIZE > enemies[i].x &&
      playerX < enemies[i].x + ENEMY_SIZE &&
      playerY + PLAYER_SIZE > enemies[i].y &&
      playerY < enemies[i].y + ENEMY_SIZE
    ) {
      // Game over
      gameOver = true;
    }
  }
  
   for (var i = 0; i < obstacles.length; i++) {
    if (
      playerX + PLAYER_SIZE > obstacles[i].x &&
      playerX < obstacles[i].x + OBSTACLE_SIZE &&
      playerY + PLAYER_SIZE > obstacles[i].y &&
      playerY < obstacles[i].y + OBSTACLE_SIZE
    ) {
      // Game over
      gameOver = true;
    }
  }
}
// Define a function to draw the game state on the canvas
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, width, height);

  // Draw the background color
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Draw the ground color
  ctx.fillStyle = groundColor;
  ctx.fillRect(0, height - PLAYER_SIZE, width, PLAYER_SIZE);

  // Draw the player box
  ctx.fillStyle = playerColor;
  ctx.fillRect(playerX, playerY, PLAYER_SIZE, PLAYER_SIZE);

  // Draw the enemies boxes
  ctx.fillStyle = enemyColor;
  for (var i = 0; i < enemies.length; i++) {
    ctx.fillRect(enemies[i].x, enemies[i].y, ENEMY_SIZE, ENEMY_SIZE);
  }

  // Draw the obstacles boxes
  ctx.fillStyle = obstacleColor;
  for (var i = 0; i < obstacles.length; i++) {
    ctx.fillRect(obstacles[i].x, obstacles[i].y, OBSTACLE_SIZE, OBSTACLE_SIZE);
  }

  // Draw the score text
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + Math.floor(score / 1000), 10, 30);
}

// Define a function to loop the game
function loop(timestamp) {
  // Calculate the progress since the last render
  var progress = timestamp - lastRender;

  // Update the game state
  update(progress);

  // Draw the game state
  draw();

  // Check if the game is over
  if (gameOver) {
    // Display a game over message
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over!", width / 2 - 100, height / 2);
  } else {
    // Request the next animation frame
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
  }
}

// Start the game loop
window.requestAnimationFrame(loop);