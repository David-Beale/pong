let ball;
let paddle1;
let paddle2;
let edgeX1 = -500
let edgeX2 = 500
let edgeY1 = -300
let edgeY2 = 300
let player1Score = 0
let player2Score = 0
let gameOver = false;
let button;
let player1Face;
let player2Face;

function preload () {
  player1Face = loadImage('./assets/brad.png');
  player2Face = loadImage('./assets/Jen.png');

}
function setup () {
  angleMode(DEGREES)
  c = createCanvas(1000, 900);
  ball = new Ball
  paddle1 = new Paddle(-480, 10, 70)
  paddle2 = new Paddle(480, 10, 70)
  createReset();
}

function draw () {
  background(57);
  translate(500, 450)
  displayPlayerPics()
  displayQueue();


  keyCheck()
  stroke(100)
  fill(255)
  strokeWeight(10)
  rect(0, 0, 1000, 600)
  strokeWeight(1)
  collisionCheck();
  ball.edgeCheck()
  ball.show()
  paddle1.show()
  paddle2.show()
  displayScore();
  scoreCheck();
  if (gameOver) {
    showReset();
  }
}
function keyCheck () {
  if (keyIsDown(UP_ARROW)) {
    paddle2.up()
  } else if (keyIsDown(DOWN_ARROW)) {
    paddle2.down()
  } else if (keyIsDown(87)) {
    paddle1.up()
  } else if (keyIsDown(83)) {
    paddle1.down()
  }
}
function collisionCheck () {
  //Right paddle
  if (ball.x + ball.radius >= paddle2.x - paddle2.width / 2 && ball.y > paddle2.y - paddle2.height / 2 - 3 && ball.y < paddle2.y + paddle2.height / 2 + 3) {
    ball.speed *= 1.05;
    let distFromMiddle = ball.y - paddle2.y;
    ball.angle = map(distFromMiddle, 35, -35, 45, -45);
    ball.speedX = -ball.speed * cos(ball.angle);
    ball.speedY = ball.speed * sin(ball.angle);;
    //Left paddle
  } else if (ball.x - ball.radius <= paddle1.x + paddle1.width / 2 && ball.y > paddle1.y - paddle1.height / 2 - 3 && ball.y < paddle1.y + paddle1.height / 2 + 3) {
    ball.speed *= 1.05;
    let distFromMiddle = ball.y - paddle1.y;
    ball.angle = map(distFromMiddle, 35, -35, 45, -45);
    ball.speedX = ball.speed * cos(ball.angle);
    ball.speedY = ball.speed * sin(ball.angle);;
  }
}
function displayScore () {
  textSize(20)
  fill(100, 150, 250)
  textAlign(CENTER);
  text(`Player 1: ${player1Score}`, -250, -365)
  text(`Player 2: ${player2Score}`, +250, -365)
}
function displayPlayerPics () {
  if (player1Face) {
    image(player1Face, -425, -425, 100, 100);
  }
  if (player2Face) {
    image(player2Face, 325, -420, 100, 100);
  }
}
function displayQueue () {
  textSize(20)
  fill(100, 150, 250)
  textAlign(CENTER);
  text(`Spectators waiting to play:`, -375, 325 )
}
function scoreCheck () {
  if (player1Score >= 5) {
    textSize(40)
    fill(250, 150, 100)
    textAlign(CENTER);
    text(`Player 1 Wins`, 0, -50)
    ball.speedX = 0;
    gameOver = true
  } else if (player2Score >= 5) {
    textSize(40)
    fill(250, 150, 100)
    textAlign(CENTER);
    text(`Player 2 Wins`, 0, -50)
    ball.speedX = 0;
    gameOver = true
  }
}
function createReset () {
  button = createButton('Start new game');
  button.size(300, 50);
  button.center();
  button.style("font-family", "Bodoni");
  button.style("font-size", "30px");
  button.style("color", "rgb(100, 150, 250)");
  button.mousePressed(reset);
  button.style('display', 'none');
}
function showReset () {
  button.show();
}
function reset () {
  gameOver = false;
  button.hide();
  player1Score = 0;
  player2Score = 0;
  paddle1.y = 0;
  paddle2.y = 0;
  setTimeout(() => {
    ball.reset();
  }, 500);
}