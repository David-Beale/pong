class Paddle {
  constructor(x, width, height) {
    this.width = width;
    this.height = height;
    this.y = 0;
    this.x = x;
    this.edgeX1 = -500
    this.edgeX2 = 500
    this.edgeY1 = -300
    this.edgeY2 = 300  }

  up () {
    this.y-=10
  }
  down () {
    this.y+=10

  }
  show () {
    this.y = constrain(this.y, this.edgeY1+this.height/2, this.edgeY2-this.height/2)
    fill(100)
    rectMode(CENTER)
    rect(this.x, this.y, this.width, this.height)

  }

}