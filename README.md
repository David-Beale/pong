# Pong
![pong](https://user-images.githubusercontent.com/59053870/77830407-15fcc280-7120-11ea-98cf-f786a0c4a5b3.JPG)
#### A classic game of pong using socket IO to connect with other players. Designed to be accessed via our social gaming app:
https://github.com/Selerski/vapour-frontend

Direct link without names or images:
https://db-pongv2.herokuapp.com/

## Installation

run `npm install` to install dependecies and create a .env file in the root directory with the following properties:
DB_USER = <insert user>
DB_PASS = <inser password>
Please note, the app is designed to connect to the social gaming database which contains player information.

## Features
* 1v1 multiplayer game
* Spectator queue for additional players
* The loser will be sent to the back of the queue, and the next in line will get to play
* Scoring system
* Player ready up system


## Built With
* Canvas and p5 library
* Socket IO
* Express Server
* Mongo DB
