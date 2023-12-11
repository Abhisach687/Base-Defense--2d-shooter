const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreEl = document.querySelector("#scoreEl");
const modalEl = document.querySelector("#modalEl");
const modalScoreEl = document.querySelector("#modalScoreEl");
const buttonEl = document.querySelector("#buttonEl");
const startButtonEl = document.querySelector("#startButtonEl");
const startModalEl = document.querySelector("#startModalEl");
const volumeUpEl = document.querySelector("#volumeUpEl");
const volumeOffEl = document.querySelector("#volumeOffEl");
const livesEl = document.querySelector("#livesEl");

// set the canvas size to the window size
canvas.width = innerWidth;
canvas.height = innerHeight;

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 10, "white");
lives = 1;
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

function init() {
  player = new Player(x, y, 10, "white");
  projectiles = [];
  enemies = [];
  particles = [];
  powerUps = [];
  animationId;
  score = 0;
  scoreEl.innerHTML = 0;
  frames = 0;
  backgroundParticles = [];
  game = {
    active: true,
  };

  lives = 1;
  livesEl.innerHTML = lives;

  const spacing = 30;

  for (let x = 0; x < canvas.width + spacing; x += spacing) {
    for (let y = 0; y < canvas.height + spacing; y += spacing) {
      backgroundParticles.push(
        new BackgroundParticle({
          position: {
            x,
            y,
          },
          radius: 3,
        })
      );
    }
  }
}

function spawnEnemies() {
  intervalId = setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

function spawnPowerUps() {
  spawnPowerUpsId = setInterval(() => {
    powerUps.push(
      new PowerUp({
        position: {
          x: -30,
          y: Math.random() * canvas.height,
        },
        velocity: {
          x: Math.random() + 2,
          y: 0,
        },
      })
    );
  }, 10000);
}

function createScoreLabel({ position, score }) {
  const scoreLabel = document.createElement("label");
  scoreLabel.innerHTML = score;
  scoreLabel.style.color = "white";
  scoreLabel.style.position = "absolute";
  scoreLabel.style.left = position.x + "px";
  scoreLabel.style.top = position.y + "px";
  scoreLabel.style.userSelect = "none";
  document.body.appendChild(scoreLabel);

  let start = null;
  const duration = 750; // duration in milliseconds
  const endOpacity = 0;
  const moveY = -30;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const easing = progress / duration; // linear easing

    scoreLabel.style.opacity = 1 - easing * (1 - endOpacity);
    scoreLabel.style.top = `${position.y + easing * moveY}px`;

    if (progress < duration) {
      window.requestAnimationFrame(step);
    } else {
      scoreLabel.parentNode.removeChild(scoreLabel);
    }
  }

  window.requestAnimationFrame(step);
}

function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  frames++;

  backgroundParticles.forEach((backgroundParticle) => {
    backgroundParticle.draw();

    const dist = Math.hypot(
      player.x - backgroundParticle.position.x,
      player.y - backgroundParticle.position.y
    );

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

  player.update();

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];

    if (powerUp.position.x > canvas.width) {
      powerUps.splice(i, 1);
    } else powerUp.update();

    const dist = Math.hypot(
      player.x - powerUp.position.x,
      player.y - powerUp.position.y
    );

    // gain power up
    if (dist < powerUp.image.height / 2 + player.radius) {
      powerUps.splice(i, 1);
      player.powerUp = "MachineGun";
      player.color = "yellow";

      // power up runs out
      setTimeout(() => {
        player.powerUp = null;
        player.color = "white";
      }, 5000);

      lives++;
      livesEl.innerHTML = lives; // Update the lives element with the new value
    }
  }

  // machine gun animation / implementation
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
  }

  for (let index = particles.length - 1; index >= 0; index--) {
    const particle = particles[index];
    if (particle.alpha < 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
    particle.update();
  }

  for (let index = projectiles.length - 1; index >= 0; index--) {
    const projectile = projectiles[index];

    projectile.update();

    //remove projectiles from edges of the screen
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      projectiles.splice(index, 1);
    }
  }

  for (let index = enemies.length - 1; index >= 0; index--) {
    const enemy = enemies[index];

    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    //end game
    if (dist - enemy.radius - player.radius < 1 && player.canTakeDamage) {
      lives--;
      livesEl.innerHTML = lives;
      // Play death sound
      audio.death.play();
      player.x = canvas.width / 2;
      player.y = canvas.height / 2;
      // Reset player's velocity
      player.velocity = { x: 0, y: 0 };
      player.canTakeDamage = false;
      setTimeout(() => {
        player.canTakeDamage = true; // player can take damage after 1 second
      }, 1000);

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

    for (
      let projectilesIndex = projectiles.length - 1;
      projectilesIndex >= 0;
      projectilesIndex--
    ) {
      const projectile = projectiles[projectilesIndex];
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      //projectile enemy collision
      if (dist - enemy.radius - projectile.radius < 1) {
        //create ka-boom
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
        // shrinking big enemies
        if (enemy.radius - 10 > 5) {
          audio.damageTaken.play();
          score += 100;
          scoreEl.innerHTML = score;

          //reduce enemy size on hit animation smooth

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
          //remove enemy if they are too small
          enemies.splice(index, 1);
          createScoreLabel({
            position: {
              x: projectile.x,
              y: projectile.y,
            },
            score: 150,
          });
          // // change background particle colors
          // backgroundParticles.forEach((backgroundParticle) => {
          //   backgroundParticle.color = "white";
          //   backgroundParticle.alpha = 1;

          //   setTimeout(() => {
          //     backgroundParticle.color = enemy.color;
          //     backgroundParticle.alpha = 0.1;
          //   }, 8888);
          // });

          projectiles.splice(projectilesIndex, 1);
        }
      }
    }
  }
}

let audioInitialized = false;
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

buttonEl.addEventListener("click", () => {
  audio.select.play();
  init();
  animate();
  spawnEnemies();
  spawnPowerUps();
  modalEl.style.display = "none";
});

startButtonEl.addEventListener("click", () => {
  audio.select.play();
  init();
  animate();
  spawnEnemies();
  spawnPowerUps();
  startModalEl.style.display = "none";
});

// mute everything
volumeUpEl.addEventListener("click", () => {
  audio.background.pause();
  volumeOffEl.style.display = "block";
  volumeUpEl.style.display = "none";

  for (let key in audio) {
    audio[key].muted = true;
  }
});

// unmute everything
volumeOffEl.addEventListener("click", () => {
  if (audioInitialized) audio.background.play();
  volumeOffEl.style.display = "none";
  volumeUpEl.style.display = "block";
  for (let key in audio) {
    audio[key].muted = false;
  }
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
      player.velocity.x += 1;
      break;
    case "ArrowUp":
      player.velocity.y -= 1;
      break;
    case "ArrowLeft":
      player.velocity.x -= 1;
      break;
    case "ArrowDown":
      player.velocity.y += 1;
      break;
  }
});
