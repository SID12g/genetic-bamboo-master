import p5 from "p5";
import catImage from "./assets/cat.png";
import backgroundImage from "./assets/background.png";

let cat;
let catScalar = 0.05;
let x, y;
let isMovingLeft, isMovingRight, isMovingUp, isMovingDown;
let startTime;
let seconds = 0;

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

    const secondsOutput = document.getElementById("seconds");
    startTime = p.millis();

    const updateSeconds = () => {
      seconds = (p.millis() - startTime) / 1000;
      if (secondsOutput) {
        secondsOutput.innerText = `${seconds.toFixed(2)}초`;
      }
      requestAnimationFrame(updateSeconds);
    };

    updateSeconds();
  };

  p.draw = () => {
    p.background(32, 34, 57);

    const catWidth = cat.width * catScalar;
    const catHeight = cat.height * catScalar;

    const centerX = p.width / 2;
    const centerY = p.height / 2;
    const radius = p.width / 2;

    const catCenterX = x + catWidth / 2;
    const catCenterY = y + catHeight / 2;

    const distance = p.dist(centerX, centerY, catCenterX, catCenterY);
    if (distance + catWidth / 2 > radius) {
      const angle = p.atan2(catCenterY - centerY, catCenterX - centerX);
      x = centerX + (radius - catWidth / 2) * p.cos(angle) - catWidth / 2;
      y = centerY + (radius - catHeight / 2) * p.sin(angle) - catHeight / 2;
    }

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

    p.image(cat, x, y, catWidth, catHeight);
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
};

new p5(sketch);
