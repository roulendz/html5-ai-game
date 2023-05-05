// Get the canvas element and its context
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Define some game constants
var FPS = 60; // Frames per second
var GRAVITY = 0.5; // Gravity force
var FRICTION = 0.9; // Friction coefficient

// Define some game variables
var score = 0; // The player's score
var gameOver = false; // The game over flag

// Define some game objects
var player = {
    x: 100, // The player's x position
    y: 100, // The player's y position
    vx: 0, // The player's x velocity
    vy: 0, // The player's y velocity
    width: 50, // The player's width
    height: 50, // The player's height
    color: "blue", // The player's color
};

var enemies = []; // An array of enemies

// Define some game functions
function render() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw the enemies
  ctx.fillStyle = "red";
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }

  // Draw the score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function update() {
  // Update the player's position and velocity
  player.x += player.vx; // Add the x velocity to the x position
  player.y += player.vy; // Add the y velocity to the y position
  player.vy += GRAVITY; // Add the gravity force to the y velocity
  player.vx *= FRICTION; // Multiply the x velocity by the friction coefficient

  // Limit the maximum y velocity
    if (player.vy > 20) {
    // The player's y velocity is greater than 20
    player.vy = 20; // Set the y velocity to 20
    }
    if (player.vy < -20) {
    // The player's y velocity is less than -20
    player.vy = -20; // Set the y velocity to -20
    }
  // Check if the player hits the canvas boundaries and bounce back
  if (player.x < 0) {
    // The player hits the left edge
    player.x = 0; // Set the x position to 0
    player.vx = -player.vx; // Reverse the x velocity
  }
  if (player.x + player.width > canvas.width) {
    // The player hits the right edge
    player.x = canvas.width - player.width; // Set the x position to the canvas width minus the player width
    player.vx = -player.vx; // Reverse the x velocity
  }
  if (player.y < 0) {
    // The player hits the top edge
    player.y = 0; // Set the y position to 0
    player.vy = -player.vy; // Reverse the y velocity
  }
  if (player.y + player.height > canvas.height) {
    // The player hits the bottom edge
    player.y = canvas.height - player.height; // Set the y position to the canvas height minus the player height
    player.vy = -player.vy; // Reverse the y velocity
  }

  // Update the enemies' position and velocity
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    enemy.x += enemy.vx; // Add the x velocity to the x position
    enemy.y += enemy.vy; // Add the y velocity to the y position

    // Check if the enemy hits the canvas boundaries and remove it
    if (enemy.x < -enemy.width || enemy.x > canvas.width || enemy.y < -enemy.height || enemy.y > canvas.height) {
      // The enemy is out of bounds
      enemies.splice(i, 1); // Remove the enemy from the array
      i--; // Decrement i to avoid skipping an element
      score++; // Increment score by one
    }

    // Check if the enemy collides with the player and end the game
    if (enemy.x + enemy.width > player.x && enemy.x < player.x + player.width && enemy.y + enemy.height > player.y && enemy.y < player.y + player.height) {
      // The enemy overlaps with the player
      gameOver = true; // Set game over flag to true
      break; // Break out of loop
    }
  }

  // Spawn new enemies randomly from above with different speeds and sizes
  if (Math.random() < 0.01) {
    // There is a 1% chance of spawning an enemy every frame
    var enemy = {
      x: Math.random() * canvas.width, // Random x position between 0 and canvas width
      y: -50, // y position above canvas height
      vx: Math.random() * 10 - 5, // Random x velocity between -5 and 5
      vy: Math.random() * 10 + 5, // Random y velocity between 5 and 15
      width: Math.random() * 50 + 10, // Random width between 10 and 60
      height: Math.random() * 50 + 10, // Random height between 10 and 60
    };
    enemies.push(enemy); // Add enemy to array
  }

}

function render() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw the enemies
  ctx.fillStyle = "red";
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }

  // Draw the score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function loop() {
    // Call the update and render functions every frame
    update();
    render();
    requestAnimationFrame(loop);
}

// Start the game loop
loop();

// Add an event listener for keydown events
window.addEventListener("keydown", function(e) {
    // Check which key was pressed
    switch (e.key) {
        case 'ArrowLeft': // Left arrow key
            // Move the player to the left by decreasing its x velocity
            player.vx -= 5;
            break;
        case 'ArrowRight': // Right arrow key
            // Move the player to the right by increasing its x velocity
            player.vx += 5;
            break;
        case 'ArrowUp': // Up arrow key
            // Make the player jump by setting its y velocity to a negative value only if it is on the ground
            if (player.y + player.height === canvas.height) {
            // The player's bottom edge is equal to the canvas height
            player.vy = -10; // Set the y velocity to -10
            }
            break;
        }

});