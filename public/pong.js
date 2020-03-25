let ball;
let paddle1;
let paddle2;

let player1Score;
let player2Score;
let gameOver = false;
let button;
let playerFace;
let playerPos = null;
let player1Face;
let player2Face;
let name = 'Unnamed player'
let profileImage;
let dbID;
let socket;
let player;
let ballX;
let ballY;
let players = [];
let positions = {
  player1: {
    xPos: -425,
    yPos: -425,
  },
  player2: {
    xPos: 325,
    yPos: -420,
  }
}

async function preload () {
  url = window.location.href;
  let id = getQueryParams('a', url);
  let pw = getQueryParams('b', url);
  if (id && pw) {
    await fetch(`http://localhost:4000/profile/?a=${id}&b=${pw}`)
      // await fetch(`https://db-game1.herokuapp.com/profile/?a=${id}&b=${pw}`)
      .then(res => res.status < 400 ? res : Promise.reject(res))
      .then(res => {
        return res.json()
      })
      .then(data => {
        name = data.name;
        dbID = data._id;
        profileImage = data.avatar;
      })
  }
  // player1Face = loadImage('./assets/brad.png');
  // player2Face = loadImage('./assets/Jen.png');

}
function setup () {
  socket = io();
  angleMode(DEGREES)
  c = createCanvas(1000, 900);

  paddle1 = new Paddle(-480, 10, 70)
  paddle2 = new Paddle(480, 10, 70)

  socket.on('heartbeat', data => {
    players = data.players;
    player1Score = data.player1Score;
    player2Score = data.player2Score;
    ballX = data.ballX;
    ballY = data.ballY;
  });
  socket.on('player1', data => {
    paddle1.y = data;
  })
  socket.on('player2', data => {
    paddle2.y = data;
  })
}

function draw () {
  if (players.length) {
    players.forEach((player) => {
      if (player.id === socket.id) playerPos = player.position;
    })
  }
  if (profileImage) {
    playerFace = loadImage(profileImage);
    profileImage = '';
  }
  if (playerFace && playerPos !== null) {
    let { xPos, yPos } = positions[playerPos]
    image(player1Face, xPos, yPos, 100, 100);
  }
  background(57);
  translate(500, 450)
  displayPlayerPics()
  displayQueue();
  keyCheck()
  drawBorder();
  scoreCheck();
  if (ballX || ballY) drawBall();
  paddle1.show()
  paddle2.show()
  displayScore();

  player = {
    id: socket.id,
    name,
    dbID,
  }
  if (playerPos === 0) socket.emit('player1', paddle1.y);
  else if (playerPos === 1) socket.emit('player2', paddle2.y);
  socket.emit('updatePlayer', player);


}
function keyCheck () {
  if (keyIsDown(UP_ARROW) && playerPos === 1) {
    paddle2.up()
  } else if (keyIsDown(DOWN_ARROW) && playerPos === 1) {
    paddle2.down()
  } else if (keyIsDown(UP_ARROW) && playerPos === 0) {
    paddle1.up()
  } else if (keyIsDown(DOWN_ARROW) && playerPos === 0) {
    paddle1.down()
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
  text(`Spectators waiting to play:`, -375, 325)
}
function drawBall () {
  fill(0);
  circle(ballX, ballY, 30);
}

function drawBorder () {
  stroke(100)
  fill(255)
  strokeWeight(10)
  rect(0, 0, 1000, 600)
  strokeWeight(1)
}
function getQueryParams (params, url) {

  let href = url;
  let reg = new RegExp('[?&]' + params + '=([^&#]*)', 'i');
  let queryString = reg.exec(href);
  return queryString ? queryString[1] : null;
};
function scoreCheck () {
  if (player1Score >= 5) {
    textSize(40)
    fill(250, 150, 100)
    textAlign(CENTER);
    text(`Player 1 Wins`, 0, -50)
  } else if (player2Score >= 5) {
    textSize(40)
    fill(250, 150, 100)
    textAlign(CENTER);
    text(`Player 2 Wins`, 0, -50)
  }
}