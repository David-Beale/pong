const ball = class Ball {
  constructor() {
    this.radius = 15;
    this.reset();
  }

  update () {
    if (this.speed < -20) this.speed = -20;
    else if (this.speed > 20) this.speed = 20;
    this.x += this.speedX;
    this.y += this.speedY;
  }
  waiting () {
    this.x =0
    this.y += 10;
  }


  reset () {
    this.x = 0;
    this.y = 0;
    this.angle = Math.floor(Math.random() * 80)-40
    this.speed = 10;
    if (Math.random() > 0.5) this.speedX = this.speed * Math.cos(this.angle * (Math.PI/180));
    else this.speedX = -this.speed * Math.cos(this.angle* (Math.PI/180));
    this.speedY = this.speed * Math.sin(this.angle* (Math.PI/180));
  }
  point () {
    this.x = 0
    this.y = 0
    this.speedX = 0
    this.speedY = 0;
  }

}
module.exports = ball