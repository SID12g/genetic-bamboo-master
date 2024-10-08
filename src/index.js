import p5 from "p5";

const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(880, 600);
    canvas.parent("canvas"); // 캔버스를 특정 div에 추가

    p.angleMode(10);
    p.background(220);
    p.square(20, 20, 100);
    p.rect(100, 40, 200, 100);
    p.ellipse(540, 100, 300, 100);
    p.circle(560, 100, 100);
    p.arc(540, 100, 300, 100, 180, 360, 20);
    p.line(20, 200, 200, 350);
    p.triangle(250, 350, 350, 200, 450, 350);
    p.quad(500, 250, 550, 200, 700, 300, 650, 350);

    const titleOutput = document.getElementById("title");
    titleOutput.innerText = "죽림고수";
    const secondsOutput = document.getElementById("seconds");
    secondsOutput.innerText = "N초";
  };

  p.draw = () => {};
};

new p5(sketch);
