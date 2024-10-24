import p5 from "p5";
import catImageSrc from "./assets/cat.png";
import backgroundImage from "./assets/background.png";
import { Layer, Network } from "synaptic";

let catImage;
let catScalar = 0.05;
let cats = [];
let arrows = [];
let arrowSpeed = 2;
let arrowSpawnInterval = (Math.random() * 0.5 + 0.5) * 1000;
setInterval(() => {
  arrowSpawnInterval = (Math.random() * 0.5 + 0.5) * 1000;
}, 500);
let lastMultipleArrowTime = 0;
let generation = 1;
let startTime = Date.now();
let brains = [];
let records = [];

/** 현재 시간 */
const getElapsedTime = () => {
  const currentTime = Date.now();
  const elapsedTime = (currentTime - startTime) / 1000;
  return elapsedTime.toFixed(2);
};

/** 고양이 클래스 */
class Cat {
  constructor(x, y, index) {
    this.x = x;
    this.y = y;
    this.index = index;
    this.brain = setupNeuralNetwork();
    this.alive = true;
    this.survive;
  }

  /** 고양이 움직임 판단 */
  think(arrows, p) {
    let closestArrow = null;
    let minDistance = Infinity;

    for (const arrow of arrows) {
      const dist = p.dist(this.x, this.y, arrow.x, arrow.y);
      if (dist < minDistance) {
        minDistance = dist;
        closestArrow = arrow;
      }
    }

    const K = 5000;
    if (closestArrow) {
      console.log("Closest Arrow:", closestArrow);
      const inputs = [
        this.x * K,
        this.y * K,
        closestArrow.x * K,
        closestArrow.y * K,
        closestArrow.vx * K,
        closestArrow.vy * K,
      ];
      console.log("Inputs:", inputs);

      const output = this.brain.activate(inputs);
      console.log("Output:", output);

      console.log(
        `${this.index}번: Output: Up: ${output[0]}, Down: ${output[1]}, Left: ${output[2]}, Right: ${output[3]}, x: ${this.x}, y: ${this.y}`
      );

      const Dy = output[0] - output[1];
      const Dx = output[2] - output[3];
      if (Dy > 0 && this.y < p.height) {
        this.y += Dy * 10;
      } else if (Dy < 0 && this.y + catImage.height * catScalar > 0) {
        this.y += Dy * 10;
      }
      if (Dx > 0 && this.x + catImage.weight * catScalar < p.width) {
        this.x += Dx * 10;
      } else if (Dx < 0 && this.x > 0) {
        this.x += Dx * 10;
      }

      const centerX = p.width / 2;
      const centerY = p.height / 2;
      const radius = Math.min(p.width, p.height) / 2 - 10;

      const distanceFromCenter = Math.sqrt(
        (this.x - centerX) ** 2 + (this.y - centerY) ** 2
      );

      if (distanceFromCenter > radius) {
        const angle = Math.atan2(this.y - centerY, this.x - centerX);
        this.x = centerX + radius * Math.cos(angle);
        this.y = centerY + radius * Math.sin(angle);
      }
    }
  }
}

/** 고양이 인공 신경망 구조 */
const setupNeuralNetwork = () => {
  const inputLayer = new Layer(6);
  const hiddenLayer = new Layer(8);
  const outputLayer = new Layer(4);

  inputLayer.project(hiddenLayer);

  hiddenLayer.project(outputLayer);

  const network = new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer,
  });

  return network;
};

/** 돌연변이 생성 */
const mutate = (network) => {
  network.layers.hidden.forEach((layer) => {
    layer.list.forEach((neuron) => {
      Object.values(neuron.connections.projected).forEach((connection) => {
        if (Math.random() < 0.1) {
          connection.weight += Math.random() * 0.2 - 0.1;
        }
      });
    });
  });
};

/** 상위 2개 brain을 랜덤으로 결정한 후 다음 세대에 상속 */
const crossover = (brain1, brain2) => {
  const newBrain = setupNeuralNetwork();
  newBrain.layers.hidden.forEach((layer, i) => {
    layer.list.forEach((neuron, j) => {
      Object.values(neuron.connections.projected).forEach((connection, k) => {
        const parentConnection =
          Math.random() > 0.5
            ? Object.values(
                brain1.layers.hidden[i].list[j].connections.projected
              )[k]
            : Object.values(
                brain2.layers.hidden[i].list[j].connections.projected
              )[k];
        connection.weight = parentConnection.weight;
      });
    });
  });

  return newBrain;
};

/** 새 세대 고양이 생성 */
const generateCats = (brain1, brain2) => {
  generation++;
  cats = [];

  for (let i = 0; i < 10; i++) {
    let newBrain;
    if (brain1 && brain2) {
      newBrain = crossover(brain1, brain2);
      mutate(newBrain);
    } else {
      newBrain = setupNeuralNetwork();
    }

    const newCat = new Cat(281, 281, i);
    newCat.brain = newBrain;
    cats.push(newCat);
  }
};

/** 현재 남은 개체 수 */
const updateRemainingCats = () => {
  const remainingCats = cats.filter((cat) => cat.alive).length;
  const remainingCatsElement = document.getElementById("remain");
  remainingCatsElement.innerText = `남은 개체 수: ${remainingCats}`;
};

/** p5.js 함수 */
const sketch = (p) => {
  /** 고양이 캐릭터 로딩 */
  p.preload = () => {
    catImage = p.loadImage(catImageSrc);
  };

  /** 초기 설정 (1번만 실행됨) */
  p.setup = () => {
    const canvas = p.createCanvas(562, 562);
    canvas.parent("canvas");

    const backgroundImg = document.getElementById("background");
    backgroundImg.src = backgroundImage;

    const generationElement = document.getElementById("generation");
    generationElement.innerText = `${generation}세대`;

    setInterval(spawnArrow, arrowSpawnInterval);

    generateCats();
    updateSeconds();
    updateRemainingCats();
  };

  /** 반복 실행 설정 (반복됨) */
  p.draw = () => {
    p.background(32, 34, 57);

    /** 생존 중인 고양이에 대한 함수 */
    cats.forEach((cat) => {
      if (cat.alive) {
        cat.think(arrows, p);

        arrows.forEach((arrow) => {
          if (checkCollision(cat, arrow, p)) {
            cat.alive = false;
            cat.survive = getElapsedTime();
          }
        });

        p.image(
          catImage,
          cat.x,
          cat.y,
          catImage.width * catScalar,
          catImage.height * catScalar
        );
      }
    });

    /** 화살 모양 함수 */
    arrows.forEach((arrow) => {
      arrow.x += arrow.vx * arrowSpeed;
      arrow.y += arrow.vy * arrowSpeed;

      if (
        arrow.x < 0 ||
        arrow.x > p.width ||
        arrow.y < 0 ||
        arrow.y > p.height
      ) {
        arrows.splice(arrows.indexOf(arrow), 1);
      }

      p.stroke(255, 255, 255);
      p.strokeWeight(4);
      p.line(
        arrow.x,
        arrow.y,
        arrow.x - arrow.vx * 10,
        arrow.y - arrow.vy * 10
      );
    });

    updateRemainingCats();

    /** 모든 개체가 죽은 경우 */
    if (cats.every((cat) => !cat.alive)) {
      arrows = [];
      cats.sort((a, b) => b.survive - a.survive);
      const generationElement = document.getElementById("generation");
      generationElement.innerText = `${generation}세대`;
      brains[generation - 1] = [cats[0].brain, cats[1].brain];
      records[generation - 1] = cats[0].survive;
      console.log(cats[0].brain, cats[1].brain);
      console.log(brains);
      console.log(records);
      generateCats(cats[0].brain, cats[1].brain);
      startTime = Date.now();
    }

    /** 화살 생성 간격 조절 */
    if (getElapsedTime() - startTime > 10000) {
      arrowSpawnInterval = Math.max(500, arrowSpawnInterval - 100);
      startTime = getElapsedTime();
    }

    /** 동시에 많은 화살 생성 간격 */
    if (getElapsedTime() / 1000 - lastMultipleArrowTime >= 10) {
      spawnMultipleArrows(((getElapsedTime() / 1000) * 3) / 5 + 10);
      lastMultipleArrowTime = getElapsedTime() / 1000;
    }
  };

  /** 화살 생성 */
  function spawnArrow() {
    const edge = Math.floor(Math.random() * 4);
    let arrow = { x: 0, y: 0, vx: 0, vy: 0 };
    const angleOffset = (Math.random() * Math.PI) / 6;

    switch (edge) {
      case 0:
        arrow.x = Math.random() * p.width;
        arrow.y = 0;

        const angle0 =
          Math.PI / 2 + (Math.random() < 0.5 ? -angleOffset : angleOffset);
        arrow.vx = Math.cos(angle0) * arrowSpeed;
        arrow.vy = Math.sin(angle0) * arrowSpeed;
        break;
      case 1:
        arrow.x = p.width;
        arrow.y = Math.random() * p.height;

        const angle1 =
          Math.PI + (Math.random() < 0.5 ? -angleOffset : angleOffset);
        arrow.vx = Math.cos(angle1) * arrowSpeed;
        arrow.vy = Math.sin(angle1) * arrowSpeed;
        break;
      case 2:
        arrow.x = Math.random() * p.width;
        arrow.y = p.height;

        const angle2 =
          -Math.PI / 2 + (Math.random() < 0.5 ? -angleOffset : angleOffset);
        arrow.vx = Math.cos(angle2) * arrowSpeed;
        arrow.vy = Math.sin(angle2) * arrowSpeed;
        break;
      case 3:
        arrow.x = 0;
        arrow.y = Math.random() * p.height;

        const angle3 = Math.random() < 0.5 ? angleOffset : -angleOffset;
        arrow.vx = Math.cos(angle3) * arrowSpeed;
        arrow.vy = Math.sin(angle3) * arrowSpeed;
        break;
    }

    arrows.push(arrow);
  }

  /** 동시 화살 생성 */
  function spawnMultipleArrows(count) {
    for (let i = 0; i < count; i++) {
      spawnArrow();
    }
  }

  /** UI 시간 업데이트 */
  function updateSeconds() {
    const secondsOutput = document.getElementById("seconds");
    if (secondsOutput) {
      secondsOutput.innerText = `${getElapsedTime()}초`;
    }

    requestAnimationFrame(updateSeconds);
  }

  /** 고양이 위치 및 화살 인식 오류 제거 */
  function checkCollision(cat, arrow, p) {
    const catLeft = cat.x;
    const catRight = cat.x + catImage.width * catScalar;
    const catTop = cat.y;
    const catBottom = cat.y + catImage.height * catScalar;

    const arrowLeft = arrow.x - arrow.vx * 10;
    const arrowRight = arrow.x;
    const arrowTop = arrow.y - arrow.vy * 10;
    const arrowBottom = arrow.y;

    return !(
      catLeft > arrowRight ||
      catRight < arrowLeft ||
      catTop > arrowBottom ||
      catBottom < arrowTop
    );
  }
};

new p5(sketch);
