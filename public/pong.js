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
let player1Status;
let player2Status;
let name = 'Unnamed player'
let profileImage;
let dbID;
let font;
let socket;
let player;
let ballX;
let ballY;
let faces = {};
let players = [];
let positions = {
  0: {
    xPos: -425,
    yPos: -425,
  },
  1: {
    xPos: 325,
    yPos: -420,
  },
  2: {
    xPos: -475,
    yPos: 335,
  },
  3: {
    xPos: -370,
    yPos: 335,
  },
  4: {
    xPos: -265,
    yPos: 335,
  },
  5: {
    xPos: -160,
    yPos: 335,
  },
  6: {
    xPos: -55,
    yPos: 335,
  },
  7: {
    xPos: 50,
    yPos: 335,
  },
  8: {
    xPos: 155,
    yPos: 335,
  },
  9: {
    xPos: 260,
    yPos: 335,
  }

}

async function preload () {
  font = loadFont('./font.otf');
  url = window.location.href;
  let id = getQueryParams('a', url);
  let pw = getQueryParams('b', url);
  if (id && pw) {
    // await fetch(`http://localhost:4000/profile/?a=${id}&b=${pw}`)
    await fetch(`https://db-pong.herokuapp.com/profile/?a=${id}&b=${pw}`)
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
  createReset();

  paddle1 = new Paddle(-480, 10, 70)
  paddle2 = new Paddle(480, 10, 70)

  socket.on('heartbeat', data => {
    players = data.players;
    player1Score = data.player1Score;
    player2Score = data.player2Score;
    ballX = data.ballX;
    ballY = data.ballY;
    player1Status = data.player1Status;
    player2Status = data.player2Status;
  });
  socket.on('player1', data => {
    paddle1.y = data;
  })
  socket.on('player2', data => {
    paddle2.y = data;
  })
  socket.on('queueUpdate', players => {
    players.forEach((player) => {
      if (player.id === socket.id) playerPos = player.position;
    })
  })
}

function draw () {
  background(57);
  if (players.length && playerPos === null) {
    players.forEach((player) => {
      if (player.id === socket.id) playerPos = player.position;
    })
  }
  if (profileImage) {
    playerFace = loadImage(profileImage);
    profileImage = '';
  }
  translate(500, 450)
  if (playerFace && playerPos !== null) {
    let { xPos, yPos } = positions[playerPos]
    image(playerFace, xPos, yPos, 100, 100);
    renderOtherText(name, 20, 'blue', xPos, yPos);
  } else if (playerPos !== null) {
    let { xPos, yPos } = positions[playerPos]
    fill(255);
    circle(xPos + 50, yPos + 50, 100);
    renderOtherText(name, 20, 'blue', xPos, yPos);
  }
  displayPlayerPics()
  displayQueue();
  keyCheck()
  drawBorder();
  if ((!player1Status && playerPos === 0) || (!player2Status && playerPos === 1)) displayWaitingForYou();
  else if ((!player1Status && playerPos === 1) || (!player2Status && playerPos === 0)) displayWaitingForOther();
  else if (!player1Status || !player2Status) displayWaiting();
  else (button.hide())
  displayPosition();
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
  players.forEach((plyr) => {
    if (plyr.id !== socket.id && plyr.position !== null) {
      let position = plyr.position
      let xPos = positions[position].xPos
      let yPos = positions[position].yPos
      // console.log(plyr.position)
      // let { xPos, yPos } = positions[position]
      if (plyr.dbID && !faces[plyr.id]) {
        faces[plyr.id] = 'loading'
        getPlayerPic(plyr.id, plyr.dbID);
      }
      if (faces[plyr.id] && faces[plyr.id] !== 'loading') {
        image(faces[plyr.id], xPos, yPos, 100, 100);

      } else {
        fill(0, 0, 255);
        circle(xPos + 50, yPos + 50, 100);
      }
      if (plyr.name) renderOtherText(plyr.name, 20, 'blue', xPos, yPos);
    }
  })
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
    setTimeout(() => {
      if (playerPos <= 1) button.show();
    }, 3000);
  } else if (player2Score >= 5) {
    textSize(40)
    fill(250, 150, 100)
    textAlign(CENTER);
    text(`Player 2 Wins`, 0, -50)
    setTimeout(() => {
      if (playerPos <= 1) button.show();
    }, 3000);
  }
}
function createReset () {
  button = createButton('Press when ready');
  button.size(300, 50);
  button.center();
  button.style("font-family", "Bodoni");
  button.style("font-size", "30px");
  button.style("color", "rgb(100, 150, 250)");
  button.mousePressed(reset);
  // button.style('display', 'none');
}
function reset () {
  button.hide();
  if (playerPos <= 1) {
    socket.emit('playerReady', playerPos);
  }

}
function displayWaiting () {
  textSize(40)
  fill(250, 150, 100)
  textAlign(CENTER);
  text(`Waiting for players to ready up...`, 0, -50)
}
function displayWaitingForYou () {
  textSize(40)
  fill(250, 150, 100)
  textAlign(CENTER);
  text(`Waiting for you...`, 0, -50)
  button.show()
}
function displayWaitingForOther () {
  textSize(40)
  fill(250, 150, 100)
  textAlign(CENTER);
  text(`Waiting for other player...`, 0, -50)
  button.hide()
}
function displayPosition () {
  textSize(40)
  fill(250, 150, 100)
  textAlign(CENTER);
  if (playerPos === 0) text(`You are Player 1`, 0, -350)
  else if (playerPos === 1) text(`You are Player 2`, 0, -350)
  else text(`You are Spectating`, 0, -350)
}
function getPlayerPic (socketID, dbID) {
  console.log('getting pic')
  // fetch(`http://localhost:4000/face/?a=${dbID}`)
  fetch(`https://db-pong.herokuapp.com/face/?a=${dbID}`)
    
  
    .then(res => res.status < 400 ? res : Promise.reject(res))
    .then(res => {
      return res.json()
    })
    .then(data => {
      if (data) {
        faces[socketID] = loadImage(data.avatar)
      }
    })
}
function renderOtherText (name, size, color, xPos, yPos) {
  rectMode(CORNER)
  let x = xPos + 50;
  let y = yPos + 25;
  let bbox = font.textBounds(name, x, y, size);
  fill(255);
  rect(bbox.x, bbox.y, bbox.w + 5, bbox.h);
  fill(color);
  textAlign(CENTER);
  textFont(font);
  textSize(size);
  text(name, x, y);
  rectMode(CENTER)
}
function displayQueue () {
  textSize(20)
  fill(100, 150, 250)
  textAlign(CENTER);
  text(`Spectators waiting to play:`, -350, 325)
}