const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const path = require('path');
const mongoose = require('mongoose');
const User = require(path.join(__dirname, 'Models/User'));
const Ball = require(path.join(__dirname, 'ball'));
require('dotenv').config();
const { DB_URI } = process.env;

//Serve game
app.use(express.static(path.join(__dirname, 'public')));
//Get face and name
app.get('/profile', async function (req, res) {
  let id = req.query.a;
  let password = req.query.b;
  let profile = await User.findById(id, '_id name password avatar ');
  if (profile && profile.password === password) {
    res.status(200).send(JSON.stringify(profile))
  } else {
    res.status(400).send()
  }
});
app.get('/face', async function (req, res) {
  let id = req.query.a;
  let profile = await User.findById(id, 'avatar')
  res.status(200).send(JSON.stringify(profile))
});
//Connect to Mongo

mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(e => console.log(e));

const server = app.listen(PORT, console.log(`Server started on port ${PORT}: http://localhost:${PORT}`));

const io = require('socket.io')(server);


let playerQueue = [];
const players = {};
const edgeX1 = -500
const edgeX2 = 500
const edgeY1 = -300
const edgeY2 = 300
const ball = new Ball;
let player1Status = 0;
let player2Status = 0;
let player1Score = 0;
let player2Score = 0;
let once = 0;
const paddle1 = {
  x: -480,
  y: 0,
  width: 10,
  height: 70,
}
const paddle2 = {
  x: 480,
  y: 0,
  width: 10,
  height: 70,
}

function collisionCheck () {
}
setInterval(heartbeat, 16);
function heartbeat () {
  if (playerQueue.length > 0) {
    if (player1Status === 1 && player2Status === 1) {
      ball.update()
      collisionCheck();
      edgeCheck()
      scoreCheck();
    } else {
      ball.waiting()
      edgeCheck()
    }
    io.sockets.emit('heartbeat', {
      players: Object.values(players),
      player1Score,
      player2Score,
      ballX: ball.x,
      ballY: ball.y,
      player1Status,
      player2Status,
    });
  }
}



io.sockets.on('connection', socket => {
  console.log('new connection ' + socket.id)
  playerQueue.push(socket.id)
  players[socket.id] = {
    position: playerQueue.indexOf(socket.id)
  }
  socket.on('updatePlayer', data => {
    players[socket.id] = { ...players[socket.id], ...data };
  })
  socket.on('player1', data => {
    paddle1.y = data;
    socket.broadcast.emit('player1', data)
  })
  socket.on('player2', data => {
    paddle2.y = data;
    socket.broadcast.emit('player2', data)
  })
  socket.on('playerReady', data => {
    if (data === 0) player1Status = 1;
    else if (data === 1) player2Status = 1;
  })




  socket.on('disconnect', () => {
    if (playerQueue.indexOf(socket.id) <= 1) {
      player1Status = 0;
      player2Status = 0;
      reset()

    }
    delete players[socket.id]
    playerQueue = playerQueue.filter(player => {
      return player !== socket.id
    })
    Object.keys(players).forEach(socketID => {
      players[socketID].position = playerQueue.indexOf(socketID)
    })
    socket.broadcast.emit('queueUpdate', Object.values(players))
    console.log('Client has disconnected');
  });
});

function collisionCheck () {
  //Right paddle
  if (ball.x + ball.radius >= paddle2.x - paddle2.width / 2 && ball.y > paddle2.y - paddle2.height / 2 - 3 && ball.y < paddle2.y + paddle2.height / 2 + 3) {
    ball.speed *= 1.05;
    let distFromMiddle = ball.y - paddle2.y;
    ball.angle = map(distFromMiddle, 35, -35, 45, -45);
    ball.speedX = -ball.speed * Math.cos(ball.angle * (Math.PI / 180));
    ball.speedY = ball.speed * Math.sin(ball.angle * (Math.PI / 180));
    //Left paddle
  } else if (ball.x - ball.radius <= paddle1.x + paddle1.width / 2 && ball.y > paddle1.y - paddle1.height / 2 - 3 && ball.y < paddle1.y + paddle1.height / 2 + 3) {
    ball.speed *= 1.05;
    let distFromMiddle = ball.y - paddle1.y;
    ball.angle = map(distFromMiddle, 35, -35, 45, -45);
    ball.speedX = ball.speed * Math.cos(ball.angle * (Math.PI / 180));
    ball.speedY = ball.speed * Math.sin(ball.angle * (Math.PI / 180));
  }
}
function scoreCheck () {
  if ((player1Score < 5 && player2Score < 5)) once = 0;
  else if ((player1Score >= 5 || player2Score >= 5) && once === 0) {
    once = 1
    ball.speedX = 0;
    setTimeout(() => {
      player1Status = 0;
      player2Status = 0;
      let loserSocket
      if (player1Score >= 5) {
        loserSocket = playerQueue[1]
        playerQueue.splice(1, 1)
      }
      else {
        loserSocket = playerQueue[0]
        playerQueue.splice(0, 1)
      }
      playerQueue.push(loserSocket)
      Object.keys(players).forEach(socketID => {
        players[socketID].position = playerQueue.indexOf(socketID)
      })
      io.sockets.emit('queueUpdate', Object.values(players))
      reset()
    }, 3000);
  } else if ((player1Score >= 5 || player2Score >= 5) && once === 1) {
    ball.speedX = 0;
  }
}
function reset () {
  gameOver = false;
  player1Score = 0;
  player2Score = 0;
  paddle1.y = 0;
  paddle2.y = 0;
  ball.reset();
}
function edgeCheck () {
  if (ball.x - ball.radius <= edgeX1) {
    player2Score++;
    ball.point()
    setTimeout(() => {
      ball.reset();
    }, 700);
  }
  else if (ball.x + ball.radius >= edgeX2) {
    player1Score++;
    ball.point()
    setTimeout(() => {
      ball.reset()
    }, 700);
  }
  else if (ball.y - ball.radius <= edgeY1) ball.speedY = -ball.speedY;
  else if (ball.y + ball.radius >= edgeY2) ball.speedY = -ball.speedY;
}
function map (value, range1Max, range1Min, range2Max, range2Min) {
  if (value > range1Max) value = range1Max;
  else if (value < range1Min) value = range1Min;

  return Math.round(value * range2Max / range1Max)

}