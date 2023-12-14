function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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
    let speedMultiplier = 1;
    if (level === 1) {
      speedMultiplier = 1;
    } else if (level === 2 || level === 3) {
      speedMultiplier = level * 0.8;
    }
    const velocity = {
      x: Math.cos(angle) * speedMultiplier,
      y: Math.sin(angle) * speedMultiplier,
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
