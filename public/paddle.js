class Paddle {
  constructor(x, width, height) {
    this.width = width;
    this.height = height;
    this.y = 0;
    this.x = x;
  }

  up () {
    this.y-=10
  }
  down () {
    this.y+=10

  }
  show () {
    this.y = constrain(this.y, edgeY1+this.height/2, edgeY2-this.height/2)
    fill(100)
    rectMode(CENTER)
    rect(this.x, this.y, this.width, this.height)

  }

}