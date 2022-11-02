let ship;
let asteroids;
let lasers;
let score = 0;
const startingLives = 3;
let lives = startingLives;
let lasers_shot = 0;
let progress;
let handleGame;
let handleLevels;
let finTime;

function setup() {
  createCanvas(800, 800);
  ship = new Ship();
  handleLevels = new HandleLevels();
  handleGame = new HandleGame();
  asteroids = [];
  lasers = [];
}

function draw() {
  state = handleGame.state;
  outcome = state();
  if (outcome == 1) {
    handleGame.getNextLevel();
  }
}

class HandleGame {
  gamestate = 0;
  states = [homeScreen, mainLoop, winGame];

  getNextLevel() {
    this.gamestate += 1;
  }
  get state() {
    let ret = this.states[this.gamestate];
    return ret;
  }
}

class HandleLevels {
  level1 = () => {
    asteroids = [];
    asteroids.push(new Asteroid(random(100, 100)));
    return asteroids;
  };

  level2 = () => {
    asteroids = [];
    asteroids.push(new Asteroid(random(300, 300)));

    asteroids.push(new Asteroid(random(100, 200), false, 3));

    return asteroids;
  };

  level3 = () => {
    asteroids = [];
    asteroids.push(new SeekerAsteroid(random(100, 100), false, 2));
    asteroids.push(new SeekerAsteroid(random(300, 300), false, 1));
    asteroids.push(new SeekerAsteroid(random(100, 100), false, 1));
    return asteroids;
  };

  level4 = () => {
    asteroids = [];
    asteroids.push(new Asteroid(random(300, 300)));
    asteroids.push(new Asteroid(random(100, 200), false, 3));
    asteroids.push(new SeekerAsteroid(random(100, 100), false, 2));
    return asteroids;
  };

  level5 = () => {
    asteroids = [];
    asteroids.push(new SeekerAsteroid(random(100, 100), false, 2));
    asteroids.push(new SeekerAsteroid(random(100, 100), false, 2));
    asteroids.push(new Asteroid(random(100, 300), false, 4));
    asteroids.push(new Asteroid(random(100, 300), false, 4));
    return asteroids;
  };

  levels = [
    this.level1(),
    this.level2(),
    this.level3(),
    this.level4(),
    this.level5(),
  ];
  progress = 0;

  getNextLevel() {
    if (this.progress >= this.levels.length) {
      return -1;
    }
    let ret = this.levels[this.progress];
    this.progress += 1;
    return ret;
  }
}

const homeScreen = () => {
  push();
  background(0);
  fill("red");
  textSize(50);
  text(`Welcome to Asteroid Invasion!`, 70, 100);
  fill("yellow");
  textSize(30);
  text("Some evil asteroids have invaded the galaxy", 70, 200);
  text("Planet earth have built only one spaceship ", 70, 250);
  text("You must pilot this ship and defeat the asteroids", 70, 300);
  textSize(30);
  fill("green");
  text("You win when all the asteroids are destroyed", 70, 500);
  text("Use the arrow keys to move around", 70, 550);
  text("Shoot lasers at the asteroids with space bar", 70, 600);
  fill("blue");
  text("Press the up arrow to start!", 70, 660);
  pop();
  if (keyIsDown(UP_ARROW)) return 1;
  return 0;
};

const winGame = () => {
  if (lives < 1) {
    push();
    textSize(50);
    fill("red");
    text(`Oh no you died try again`, 70, height / 2);
    text(`Your final score is: ${score}`, 70, 500);
    pop();
  } else {
    background(0);
    fill("red");
    textSize(40);
    text(`Well done you saved the galaxy`, 70, 100);
    fill("yellow");
    textSize(30);
    text("You saved over 100 billion humans", 70, 200);
    text("You also saved 1 trillion other aliens  ", 70, 250);
    text("You are now very famous", 70, 300);
    textSize(30);
    fill("green");
    text(`Your final score is: ${score}`, 70, 500);
    text(`Your total time to finish is: ${finTime} seconds`, 70, 550);
    text(`You lost :${startingLives - lives} lives`, 70, 600);
    fill("blue");
    text("Refresh to restart the game!", 70, 660);
    text("Try to beat your score!", 70, 720);
  }
  return 0;
};

const mainLoop = () => {
  if (asteroids.length == 0) {
    asteroids = handleLevels.getNextLevel();
    ship.makeInvincible();
    if (asteroids == -1) {
      finTime = (millis() / 1000).toFixed(1);
      return 1;
    }
  }
  if (lives < 1) return 1;
  background(0);

  if (asteroids) {
    asteroids.forEach((element) => {
      element.run();
    });
    asteroidLaserCollision();
    shipAsteroidCollision();
  }
  lasers.forEach((element) => {
    element.run();
  });
  ship.run();
  getScore();
  getLives();
  return 0;
};

const asteroidLaserCollision = () => {
  let nasteroids = [];
  for (let i = 0; i < asteroids.length; i++) {
    hit = false;
    for (let j = 0; j < lasers.length; j++) {
      if (asteroids[i].contains(lasers[j].pos)) {
        hit = true;
        break;
      }
    }
    if (hit) {
      asteroids[i].createChildren().forEach((e) => {
        nasteroids.push(e);
      });
      score += 1;
    } else {
      nasteroids.push(asteroids[i]);
    }
  }
  asteroids = nasteroids;
};

const shipAsteroidCollision = () => {
  asteroids.forEach((e) => {
    if (e.contains(ship.pos) & ship.isVulnerable()) {
      lives -= 1;
      score -= 3;
      ship.invincible_time = millis() + 3000;
    }
  });
};

const getScore = () => {
  push();
  textSize(30);
  fill("red");
  text(`Score: ${score}`, 30, 30);
  pop();
};

const getLives = () => {
  push();
  textSize(30);
  fill("blue");
  text(`Lives: ${lives}`, 30, 60);
  pop();
};

function keyPressed() {
  if (key == " ") {
    lasers.push(new Laser());
    if (lasers.length > 4) {
      lasers.shift();
    }
  }
}

class Laser {
  pos = createVector(ship.pos.x, ship.pos.y);
  vel = p5.Vector.fromAngle(ship.heading + PI / 2).mult(10);
  size = 10;

  render() {
    push();
    stroke(color("red"));
    fill(color("red"));
    circle(this.pos.x, this.pos.y, this.size);
    strokeWeight(4);
    stroke(100);
    pop();
  }

  run() {
    this.pos.add(this.vel);
    this.render();
  }
}

class SeekerAsteroid {
  constructor(size = random(100, 300), pos = false, speed = 1) {
    if (!pos) {
      this.pos = createVector(random(width), random(height));
    } else {
      this.pos = createVector(pos.x, pos.y);
    }
    this.speed = speed;
    this.size = size;
    this.v = p5.Vector.random2D().mult(speed);
  }

  render() {
    push();
    let c = color("green");
    fill(c);
    stroke(c);
    circle(this.pos.x, this.pos.y, this.size);
    strokeWeight(4);
    stroke(100);
    pop();
  }

  contains(npos) {
    return (
      (this.pos.x - npos.x) ** 2 + (this.pos.y - npos.y) ** 2 <
      (this.size / 2) ** 2
    );
  }

  updatePos() {
    let ship_position = ship.pos.copy();
    let mov = ship_position.sub(this.pos).normalize().mult(1.4);
    this.pos.add(mov);
    this.pos.add(this.v);
    this.v.mult(0.999);
    console.log(this.v);
  }

  createChildren() {
    let ret = [];
    if (this.size > 50) {
      let pos1 = this.pos.add(p5.Vector.random2D().mult(100));
      let pos2 = this.pos.add(p5.Vector.random2D().mult(100));
      ret.push(
        new SeekerAsteroid(
          this.size / 2,
          pos1.add(createVector(random(20, 50), random(20, 50))),
          this.speed + random(0.9, 1.2)
        )
      );
      ret.push(
        new SeekerAsteroid(this.size / 2, pos2, this.speed + random(0.9, 1.2))
      );
    }
    return ret;
  }

  run() {
    this.updatePos();
    this.render();
    this.wrap();
  }
  wrap = wrap;
}

class Asteroid{

  constructor(size = random(100, 300), pos = false, speed = 1) {
    if (!pos) {
      this.pos = createVector(random(width), random(height));
    } else {
      this.pos = createVector(pos.x, pos.y);
    }
    this.speed = speed;
    this.vel = p5.Vector.random2D().mult(speed);
    this.size = size;
  }

  render(){
    push();
    let c = color("grey");
    fill(c);
    stroke(c);
    circle(this.pos.x, this.pos.y, this.size);
    strokeWeight(4);
    stroke(100);
    pop();
  };

  contains(npos) {
    return (
      (this.pos.x - npos.x) ** 2 + (this.pos.y - npos.y) ** 2 <
      (this.size / 2) ** 2
    );
  };
  updatePos(){
    this.pos.add(this.vel);
  };

  createChildren(){
    let ret = [];
    if (this.size > 50) {
      let pos1 = this.pos.add(p5.Vector.random2D().mult(100));
      let pos2 = this.pos.add(p5.Vector.random2D().mult(100));
      ret.push(new Asteroid(this.size / 2, pos1, this.speed));
      ret.push(new Asteroid(this.size / 2, pos2, this.speed));
    }
    return ret;
  };

  run(){
    this.updatePos();
    this.render();
    this.wrap();
  };
  wrap = wrap;
}


class Ship {
  pos = createVector(width / 2, height / 2);
  size = 50;
  heading = PI;
  rotate = 0;
  accelerating = false;
  vel = createVector(0, 0);
  invincible_time = millis() + 3000;

  isVulnerable() {
    return this.invincible_time < millis();
  }

  makeInvincible() {
    this.invincible_time = millis() + 3000;
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    translate(-20, -20);
    strokeWeight(4);
    stroke(255);
    triangle(0, 0, 40, 0, 20, 50);
    if (this.accelerating) {
      let c = color("orange");
      fill(c);
      stroke(c);
      triangle(2, 0, 10, 0, 5, -20);
      triangle(30, 0, 38, 0, 35, -20);
    }

    if (!this.isVulnerable()) {
      noFill();
      stroke("blue");
      circle(15, 17, 100);
    }
    pop();
  }

  updatePos() {
    this.pos.add(this.vel);
  }

  updateVel() {
    if (this.accelerating) {
      this.vel.add(p5.Vector.fromAngle(this.heading + PI / 2).mult(0.2));
    }
    this.vel.mult(0.99);
  }

  wrap = wrap;

  run() {
    this.render();
    this.updatePos();
    this.updateVel();
    this.wrap();
    if (keyIsDown(LEFT_ARROW)) this.heading -= 0.06;
    if (keyIsDown(RIGHT_ARROW)) this.heading += 0.06;
    this.accelerating = keyIsDown(UP_ARROW);
    if (keyIsDown(DOWN_ARROW)) this.vel.mult(0.95);
  }
}

function wrap() {
  if (this.pos.x < -50) {
    this.pos.x = width;
  }
  if (this.pos.x > width + 50) {
    this.pos.x = 0;
  }

  if (this.pos.y < -50) {
    this.pos.y = height;
  }
  if (this.pos.y > height + 50) {
    this.pos.y = 0;
  }
}
