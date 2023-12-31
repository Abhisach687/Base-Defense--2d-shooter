/**
 * This file contains the game logic for the Base Defense 2D shooter game.
 * It sets up the canvas size, initializes game variables, and defines functions for animation and event handling.
 * The game involves a player, enemies, projectiles, power-ups, rocks, and particles.
 * The player can move, shoot projectiles, and collect power-ups.
 * The enemies move towards the player and can be destroyed by projectiles.
 * Rocks serve as obstacles and can be destroyed by projectiles.
 * The game keeps track of lives, score, and level.
 * It also includes audio elements for background music, shooting sounds, and death sounds.
 * The game is controlled by mouse movement, mouse click, arrow keys, asdf keys and spacebar key press events.
 * It also includes buttons for starting and restarting the game.
 */

// set the canvas size to the window size
canvas.width = innerWidth;
canvas.height = innerHeight;

// Define initial player position
const x = canvas.width / 2;
const y = canvas.height / 2;

// Initialize game variables
let player = new Player(x, y, 10, "white");
let lives = 1;
let projectiles = [];
let enemies = [];
let particles = [];
let animationId;
let intervalId;
let score = 0;
let powerUps = [];
let frames = 0;
let backgroundParticles = [];
let game = {
  active: false,
};
let rocks = [];
let level = 1;

/**
 * The animate function is responsible for updating and rendering the game elements on each frame.
 * It uses requestAnimationFrame to continuously call itself for smooth animation.
 * It handles player movement, power-up collection, enemy and projectile updates, collision detection, and level progression.
 */
function animate() {
  if (!game.active) {
    // If the game is not active, just request the next frame and return
    requestAnimationFrame(animate);
    return;
  }
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  frames++;

  // Update and render background particles
  backgroundParticles.forEach((backgroundParticle) => {
    backgroundParticle.draw();

    const dist = Math.hypot(
      player.x - backgroundParticle.position.x,
      player.y - backgroundParticle.position.y
    );

    // Adjust background particle alpha based on player distance
    if (dist < 100) {
      backgroundParticle.alpha = 0;

      if (dist > 70) {
        backgroundParticle.alpha = 0.5;
      }
    } else if (dist > 100 && backgroundParticle.alpha < 0.1) {
      backgroundParticle.alpha += 0.01;
    } else if (dist > 100 && backgroundParticle.alpha > 0.1) {
      backgroundParticle.alpha -= 0.01;
    }
  });

  // Update and render player
  player.update();

  // Update and render power-ups
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];

    if (powerUp.position.x > canvas.width) {
      powerUps.splice(i, 1);
    } else powerUp.update();

    const dist = Math.hypot(
      player.x - powerUp.position.x,
      player.y - powerUp.position.y
    );

    // Collect power-up
    if (dist < powerUp.image.height / 2 + player.radius) {
      powerUps.splice(i, 1);
      player.powerUp = "MachineGun";
      player.color = "yellow";

      // Power-up duration
      setTimeout(() => {
        player.powerUp = null;
        player.color = "white";
      }, 5000);

      if (lives < 5) {
        // Only increase lives if lives is less than 5
        lives++;
      }

      livesEl.innerHTML = lives; // Update the lives element with the new value
    }
  }

  // Machine gun animation / implementation
  if (player.powerUp === "MachineGun") {
    const angle = Math.atan2(
      mouse.position.y - player.y,
      mouse.position.x - player.x
    );
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };

    if (frames % 2 === 0)
      projectiles.push(
        new Projectile(player.x, player.y, 5, "yellow", velocity)
      );

    if (frames % 5 === 0) {
      audio.shoot.play();
    }
  }

  // Update and render particles
  for (let index = particles.length - 1; index >= 0; index--) {
    const particle = particles[index];
    if (particle.alpha < 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
    particle.update();
  }

  // Update and render projectiles
  for (let index = projectiles.length - 1; index >= 0; index--) {
    const projectile = projectiles[index];

    projectile.update();

    // Remove projectiles from edges of the screen
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      projectiles.splice(index, 1);
    }
  }

  // Update and render enemies
  for (let index = enemies.length - 1; index >= 0; index--) {
    const enemy = enemies[index];

    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    // End game if player collides with enemy
    if (dist - enemy.radius - player.radius < 1 && player.canTakeDamage) {
      lives--;
      livesEl.innerHTML = lives;
      // Play death sound
      audio.death.play();

      // Pause the game for 2 seconds
      game.active = false;
      setTimeout(() => {
        game.active = true;
      }, 2000);

      // Reset player's position
      player.x = canvas.width / 2;
      player.y = canvas.height / 2;
      // Reset player's velocity
      player.velocity = { x: 0, y: 0 };
      player.canTakeDamage = false;
      setTimeout(() => {
        player.canTakeDamage = true; // Player can take damage after 1 second
      }, 1000);
      enemies = [];

      if (lives <= 0) {
        cancelAnimationFrame(animationId);
        clearInterval(intervalId);
        clearInterval(spawnPowerUpsId);
        game.active = false;
        // Play death sound
        audio.death.play();

        modalEl.style.display = "block";
        modalScoreEl.innerHTML = score;
      }
    }

    // Check for projectile-enemy collisions
    for (
      let projectilesIndex = projectiles.length - 1;
      projectilesIndex >= 0;
      projectilesIndex--
    ) {
      const projectile = projectiles[projectilesIndex];
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // Projectile-enemy collision
      if (dist - enemy.radius - projectile.radius < 1) {
        // Create particles for explosion effect
        for (let index = 0; index < enemy.radius * 2; index++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6),
              }
            )
          );
        }
        // Shrink big enemies or remove small enemies
        if (enemy.radius - 10 > 5) {
          audio.damageTaken.play();
          score += 100;
          scoreEl.innerHTML = score;

          // Reduce enemy size on hit animation
          const shrinkAnim = enemy.element.animate(
            [
              { borderRadius: `${enemy.radius}px` },
              { borderRadius: `${enemy.radius - 10}px` },
            ],
            { duration: 88 }
          );

          shrinkAnim.onfinish = () => {
            enemy.radius -= 10;
          };

          shrinkAnim.play();
          createScoreLabel({
            position: {
              x: projectile.x,
              y: projectile.y,
            },
            score: 100,
          });
          projectiles.splice(projectilesIndex, 1);
        } else {
          audio.explode.play();
          score += 150;
          scoreEl.innerHTML = score;
          // Remove enemy if they are too small
          enemies.splice(index, 1);
          document.body.removeChild(enemy.element);
          createScoreLabel({
            position: {
              x: projectile.x,
              y: projectile.y,
            },
            score: 150,
          });

          projectiles.splice(projectilesIndex, 1);
        }
      }
    }
  }

  // Update and render rocks
  for (let i = rocks.length - 1; i >= 0; i--) {
    const rock = rocks[i];

    rock.update();

    for (let j = projectiles.length - 1; j >= 0; j--) {
      const projectile = projectiles[j];

      const distance = Math.hypot(projectile.x - rock.x, projectile.y - rock.y);

      if (distance - rock.radius - projectile.radius < 1) {
        rock.hit();
        projectiles.splice(j, 1);
      }

      if (rock.hits >= 3) {
        rocks.splice(i, 1);
      }
    }
  }

  // Check for player-rock collisions
  for (let i = 0; i < rocks.length; i++) {
    const rock = rocks[i];
    const distance = Math.hypot(player.x - rock.x, player.y - rock.y);
    if (distance < player.radius + rock.radius) {
      // Adjust player's path to avoid the rock
      const angle = Math.atan2(player.y - rock.y, player.x - rock.x);
      player.x = rock.x + (player.radius + rock.radius) * Math.cos(angle);
      player.y = rock.y + (player.radius + rock.radius) * Math.sin(angle);
    }
  }

  // Check if the player has reached the next level
  if ((level === 1 && score >= 40000) || (level === 2 && score >= 120000)) {
    level++;
    if (lives < 5) {
      // Only increase lives if lives is less than 5
      lives++;
    }
    livesEl.innerHTML = lives;

    enemies = []; // Remove all enemies
    player.x = canvas.width / 2; // Reset player's position
    player.y = canvas.height / 2; // Reset player's position

    // Redraw rocks
    rocks = [];
    for (let i = 0; i < 10; i++) {
      const radius = Math.random() * (30 - 10) + 10;
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = Math.random() * (canvas.height - radius * 2) + radius;
      const color = "DimGray";
      rocks.push(new Rock(x, y, radius, color));
    }

    // Show level up modal
    const levelModalEl = document.querySelector("#levelModalEl");
    levelModalEl.style.display = "block";
    const currentLevelEl = document.querySelector("#currentLevelEl");
    currentLevelEl.innerHTML = level;

    // Hide level up modal after 2 seconds
    setTimeout(() => {
      levelModalEl.style.display = "none";
    }, 2000);
  }
}

// Initialize audio flag
let audioInitialized = false;

// Event listener for mouse click
window.addEventListener("click", (event) => {
  if (audio.background.paused) {
    audio.background.play();
    audioInitialized = true;
  }

  if (game.active) {
    audio.shoot.play();

    const angle = Math.atan2(
      event.clientY - player.y,
      event.clientX - player.x
    );
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };

    projectiles.push(new Projectile(player.x, player.y, 5, "white", velocity));
  }
});

// Event listener for spacebar key press
window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    audio.shoot.play();

    const angle = Math.atan2(
      mouse.position.y - player.y,
      mouse.position.x - player.x
    );
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };

    projectiles.push(new Projectile(player.x, player.y, 5, "white", velocity));
  }
});

// Event listener for mouse movement
const mouse = {
  position: {
    x: 0,
    y: 0,
  },
};
addEventListener("mousemove", (event) => {
  mouse.position.x = event.clientX;
  mouse.position.y = event.clientY;
});

// Event listener for restart button click
buttonEl.addEventListener("click", () => {
  audio.select.play();
  init();
  animate();
  spawnEnemies();
  spawnPowerUps();
  modalEl.style.display = "none";
});

// Event listener for start button click
startButtonEl.addEventListener("click", () => {
  audio.select.play();
  init();
  animate();
  spawnEnemies();
  spawnPowerUps();
  startModalEl.style.display = "none";
});

// Event listener for volume up button click
volumeUpEl.addEventListener("click", () => {
  audio.background.pause();
  volumeOffEl.style.display = "block";
  volumeUpEl.style.display = "none";

  // Mute all audio elements
  for (let key in audio) {
    audio[key].muted = true;
  }
});

// Event listener for volume off button click
volumeOffEl.addEventListener("click", () => {
  if (audioInitialized) audio.background.play();

  // Unmute all audio elements
  for (let key in audio) {
    audio[key].muted = false;
  }

  volumeOffEl.style.display = "none";
  volumeUpEl.style.display = "block";
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // inactive
    // clearIntervals
    clearInterval(intervalId);
    clearInterval(spawnPowerUpsId);
  } else {
    // spawnEnemies spawnPowerUps
    spawnEnemies();
    spawnPowerUps();
  }
});

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight":
    case "d":
      player.velocity.x += 1;
      break;
    case "ArrowUp":
    case "w":
      player.velocity.y -= 1;
      break;
    case "ArrowLeft":
    case "a":
      player.velocity.x -= 1;
      break;
    case "ArrowDown":
    case "s":
      player.velocity.y += 1;
      break;
  }
});

let touchStartX = 0;
let touchStartY = 0;

window.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

window.addEventListener(
  "touchmove",
  (event) => {
    event.preventDefault();
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const swipeX = touchEndX - touchStartX;
    const swipeY = touchEndY - touchStartY;

    if (Math.abs(swipeX) > Math.abs(swipeY)) {
      // Horizontal swipe
      player.velocity.x = swipeX / 30;
      player.velocity.y = 0;
    } else {
      // Vertical swipe
      player.velocity.x = 0;
      player.velocity.y = swipeY / 30;
    }
  },
  { passive: false }
);

window.addEventListener("touchend", () => {
  player.velocity.x = 0;
  player.velocity.y = 0;
});

// to prevent scrolling on mobile devices when swiping on the canvas
window.addEventListener("resize", resizeCanvas, false);

// Initial resize
resizeCanvas();
