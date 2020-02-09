var blobs = [];
var bullets = [];

function Blob(id, x, y, r, kills) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.kills = kills
}

function Bullet(id, x, y, c, velx, vely, d, parent) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.c = c;
  this.velx = velx;
  this.vely = vely;
  this.d = d;
  this.parent = parent;
}

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

setInterval(heartbeat, 33);
setInterval(bulletHeartbeat, 33);

function heartbeat() {
  io.sockets.emit('heartbeat', blobs);
}

function bulletHeartbeat() {
  io.sockets.emit('bulletheartbeat', bullets);
}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on(
  'connection',
  // We are given a websocket object in our function
  function(socket) {
    console.log('We have a new client: ' + socket.id);

    socket.on('start', function(data) {
      console.log(socket.id + ' ' + data.x + ' ' + data.y + ' ' + data.r);
      var blob = new Blob(socket.id, data.x, data.y, data.r, data.kills);
      blobs.push(blob);
    });

    socket.on('addbullets', function(data) {
      var bullet = new Bullet(data.id, data.x, data.y, data.c, data.velx, data.vely, data.d, data.parent);
      bullets.push(bullet);
    });

    socket.on('updatebullets', function(data) {
      var bullet;
      // console.log(bullets);
      for (var i = 0; i < bullets.length; i++) {
        if (data.id == bullets[i].id) {
          bullet = bullets[i];
          bullet.id = data.id
          bullet.x = data.x;
          bullet.y = data.y;
        }
      }
      // var bullet = new Bullet(data.id, data.x, data.y, data.c, data.velx, data.vely, data.d);
      // bullets.push(bullet);
      // console.log(bullets);
    });
    //
    socket.on('DEAD-Bullet', function(data) {
      bullets.pop(data);
    });
    //
    socket.on('DEAD-Blob', function(data) {
      // console.log("blob dead")
      for (var i = 0; i < blobs.length; i++) {
        if (blobs[i].id == data.blob) {
          blobs.pop(blobs[i]);
        } if (blobs[i].id == data.bullet) {
          blobs[i].kills++;
        }
      }
    });

    socket.on('update', function(data) {
      //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
      var blob;
      for (var i = 0; i < blobs.length; i++) {
        if (socket.id == blobs[i].id) {
          blob = blobs[i];
          blob.x = data.x;
          blob.y = data.y;
          blob.r = data.r;
          blobs.kills = data.kills;
        }
      }
    });

    socket.on('disconnect', function() {
      console.log('Client has disconnected');
      for (var i = blobs.length-1; i >= 0; i--) {
        if (blobs[i].id == socket.id) {
          console.log(blobs[i].id);
          blobs.splice(i, 1);
        }
      }
    });
  }
);
