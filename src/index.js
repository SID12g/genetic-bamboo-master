import p5 from "p5";
import catImage from "./assets/cat.png";

let cat;
let catScalar = 0.1;
let x, y;
let isMovingLeft, isMovingRight, isMovingUp, isMovingDown;

const sketch = (p) => {
  p.preload = () => {
    cat = p.loadImage(catImage);
  };

  p.setup = () => {
    const canvas = p.createCanvas(880, 600);
    canvas.parent("canvas");
    x = 440;
    y = 300;
    isMovingLeft = false;
    isMovingRight = false;
    isMovingUp = false;
    isMovingDown = false;

    const secondsOutput = document.getElementById("seconds");
    if (secondsOutput) {
      secondsOutput.innerText = "N초";
    }
  };

  p.draw = () => {
    p.background(220);

    // 이미지 크기 조절
    const catWidth = cat.width * catScalar;
    const catHeight = cat.height * catScalar;

    // 이미지 이동
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
