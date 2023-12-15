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
  rocks = [];
  level = 1;

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

  for (let i = 0; i < 10; i++) {
    const radius = Math.random() * (30 - 10) + 10;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const color = "DimGray";
    rocks.push(new Rock(x, y, radius, color));
  }
}
