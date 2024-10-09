import p5 from "p5";
import catImage from "./assets/cat.png";
import backgroundImage from "./assets/background.png";

let cat;
let catScalar = 0.05;
let x, y;
let isMovingLeft, isMovingRight, isMovingUp, isMovingDown;
let startTime;
let arrows = [];
let arrowSpeed = 2;
let arrowSpawnInterval = 1000;
let lastMultipleArrowTime = 0;
const radius = 281;

const sketch = (p) => {
  p.preload = () => {
    cat = p.loadImage(catImage);
  };

  p.setup = () => {
    const canvas = p.createCanvas(562, 562);
    canvas.parent("canvas");

    const backgroundImg = document.getElementById("background");
    backgroundImg.src = backgroundImage;

    x = 281;
    y = 281;
    isMovingLeft = false;
    isMovingRight = false;
    isMovingUp = false;
    isMovingDown = false;

    startTime = p.millis();
    setInterval(spawnArrow, arrowSpawnInterval);

    updateSeconds();
  };

  p.draw = () => {
    p.background(32, 34, 57);

    const catWidth = cat.width * catScalar;
    const catHeight = cat.height * catScalar;

    if (isMovingUp && y > 0) {
      y -= 5;
    }
    if (isMovingDown && y < p.height - catHeight) {
      y += 5;
    }
    if (isMovingLeft && x > 0) {
      x -= 5;
    }
    if (isMovingRight && x < p.width - catWidth) {
      x += 5;
    }

    const distFromCenter = p.dist(x, y, 281, 281);
    if (distFromCenter + catWidth / 2 > radius) {
      const angle = Math.atan2(y - 281, x - 281);
      x = 281 + (radius - catWidth / 2) * Math.cos(angle);
      y = 281 + (radius - catWidth / 2) * Math.sin(angle);
    }

    for (let i = arrows.length - 1; i >= 0; i--) {
      const arrow = arrows[i];
      arrow.x += arrow.vx * arrowSpeed;
      arrow.y += arrow.vy * arrowSpeed;

      if (
        arrow.x < 0 ||
        arrow.x > p.width ||
        arrow.y < 0 ||
        arrow.y > p.height
      ) {
        arrows.splice(i, 1);
        continue;
      }

      if (
        p.dist(arrow.x, arrow.y, x + catWidth / 2, y + catHeight / 2) <
        catWidth / 2
      ) {
        p.noLoop();
        alert(`${(p.millis() / 1000).toFixed(2)}초를 버텨냈어요! 😺`);
        location.reload();
        return;
      }

      p.stroke(255, 255, 255);
      p.strokeWeight(4);
      p.line(
        arrow.x,
        arrow.y,
        arrow.x - arrow.vx * 10,
        arrow.y - arrow.vy * 10
      );
    }

    p.image(cat, x, y, catWidth, catHeight);

    setInterval(() => {
      arrowSpeed += 0.0005;
    }, 3000);

    if (p.millis() - startTime > 10000) {
      arrowSpawnInterval = Math.max(500, arrowSpawnInterval - 100);

      setInterval(spawnArrow, arrowSpawnInterval);
      startTime = p.millis();
    }

    if (p.millis() / 1000 - lastMultipleArrowTime >= 10) {
      spawnMultipleArrows(((p.millis() / 1000) * 3) / 5 + 10);
      lastMultipleArrowTime = p.millis() / 1000;
    }
  };

  p.keyPressed = () => {
    if (p.key === "ArrowUp") {
      isMovingUp = true;
    }
    if (p.key === "ArrowDown") {
      isMovingDown = true;
    }
    if (p.key === "ArrowLeft") {
      isMovingLeft = true;
    }
    if (p.key === "ArrowRight") {
      isMovingRight = true;
    }
  };

  p.keyReleased = () => {
    if (p.key === "ArrowUp") {
      isMovingUp = false;
    }
    if (p.key === "ArrowDown") {
      isMovingDown = false;
    }
    if (p.key === "ArrowLeft") {
      isMovingLeft = false;
    }
    if (p.key === "ArrowRight") {
      isMovingRight = false;
    }
  };

  function spawnArrow() {
    const edge = Math.floor(Math.random() * 4);
    let arrow = { x: 0, y: 0, vx: 0, vy: 0 };

    switch (edge) {
      case 0:
        arrow.x = Math.random() * p.width;
        arrow.y = 0;
        arrow.vx =
          (p.width / 2 - arrow.x) /
          p.dist(arrow.x, arrow.y, p.width / 2, p.height / 2);
        arrow.vy =
          (p.height / 2 - arrow.y) /
          p.dist(arrow.x, arrow.y, p.width / 2, p.height / 2);
        break;
      case 1:
        arrow.x = p.width;
        arrow.y = Math.random() * p.height;
        arrow.vx =
          (p.width / 2 - arrow.x) /
          p.dist(arrow.x, arrow.y, p.width / 2, p.height / 2);
        arrow.vy =
          (p.height / 2 - arrow.y) /
          p.dist(arrow.x, arrow.y, p.width / 2, p.height / 2);
        break;
      case 2:
        arrow.x = Math.random() * p.width;
        arrow.y = p.height;
        arrow.vx =
          (p.width / 2 - arrow.x) /
          p.dist(arrow.x, arrow.y, p.width / 2, p.height / 2);
        arrow.vy =
          (p.height / 2 - arrow.y) /
          p.dist(arrow.x, arrow.y, p.width / 2, p.height / 2);
        break;
      case 3:
        arrow.x = 0;
        arrow.y = Math.random() * p.height;
        arrow.vx =
          (p.width / 2 - arrow.x) /
          p.dist(arrow.x, arrow.y, p.width / 2, p.height / 2);
        arrow.vy =
          (p.height / 2 - arrow.y) /
          p.dist(arrow.x, arrow.y, p.width / 2, p.height / 2);
        break;
    }

    arrows.push(arrow);
  }

  function spawnMultipleArrows(count) {
    for (let i = 0; i < count; i++) {
      spawnArrow();
    }
  }

  function updateSeconds() {
    const secondsOutput = document.getElementById("seconds");
    if (secondsOutput) {
      secondsOutput.innerText = `${(p.millis() / 1000).toFixed(2)}초`;
    }

    requestAnimationFrame(updateSeconds);
  }
};

new p5(sketch);
