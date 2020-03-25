class Ball {
  constructor() {

    this.radius = 15;
    this.reset();
  }

  show () {
    this.speedX = constrain(this.speedX, -20, 20);
    this.x += this.speedX;
    this.y += this.speedY;
    fill(0);
    circle(this.x, this.y, this.radius * 2);
  }

  edgeCheck () {
    if (this.x - this.radius <= edgeX1) {
      player2Score++;
      this.point()
      setTimeout(() => {
        this.reset();
      }, 500);
    }
    else if (this.x + this.radius >= edgeX2) {
      player1Score++;
      this.point()
      setTimeout(() => {
        this.reset()
      }, 700);
    }
    else if (this.y - this.radius <= edgeY1) this.speedY = -this.speedY;
    else if (this.y + this.radius >= edgeY2) this.speedY = -this.speedY;
  }
  reset () {
    this.x = 0;
    this.y = 0;
    this.angle = random(40, -40)
    this.speed = 10
    if (random(1) > 0.5) this.speedX = this.speed * cos(this.angle);
    else this.speedX = -this.speed * cos(this.angle);
    this.speedY = this.speed * sin(this.angle);;
  }
  point () {
    this.x = 0
    this.y = 0
    this.speedX = 0
    this.speedY = 0;
  }

}