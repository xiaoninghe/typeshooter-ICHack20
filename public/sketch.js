var blob;
var socket;
var blobs = [];
var bullets = [];
var idCount = 0;
var BLACK = 0;
var WHITE = 255;

function setup() {
  // put setup code here
  createCanvas(displayWidth, displayHeight);
  socket = io.connect('http://localhost:3000');
  blob = new Blob(random(width), random(height), WHITE, 0);

  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
    kills: blob.kills
  };
  socket.emit('start', data);
  socket.on('heartbeat',
    function (data) {
      blobs = data;
    }
  );
  socket.on('bulletheartbeat',
    function (data) {
      bullets = data;
    });
}

function draw() {
  background(BLACK);

  translate(width / 2 - blob.pos.x, height / 2 - blob.pos.y - 100);
  for (var x = -1.5 * width; x < 1.5 * width; x += 250) {
    stroke(216);
    strokeWeight(1);
    line(x, -1.5 * height, x, 1.5 * height);
  }
  for (var y = -1.5 * height; y < 1.5 * height; y += 250) {
    stroke(216);
    strokeWeight(1);
    line(-2 * width, y, 2 * width, y);
  }

  for (var i = blobs.length - 1; i >= 0; i--) {
    if (blobs[i].id !== socket.id) {
      fill(255, 127, 0);
      ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);

      fill(WHITE);
      textAlign(CENTER);
      text(allNames[random(allNames.length)]);
    }
  }
  blob.show();
  blob.update();
  blob.constrain();

  fill(WHITE);
  rect(blob.pos.x + 400, blob.pos.y - 370, 200, 270);

  fill(BLACK);
  textSize(20);
  for (var i = 0; i < 10; i++) {
    if (i == 0) {
      text(words[i], blob.pos.x + 500, blob.pos.y - 335 + i * 20)
    } else {
      text(words[i], blob.pos.x + 500, blob.pos.y - 320 + i * 20)
    }
  }
  fill(WHITE);
  textSize(48);
  var typeOrBattle = blob.getMode();
  var modetext;
  if (typeOrBattle) {
    modetext = "Typing"
  } else {
    modetext = "Attacking"
  }
  text(modetext, blob.pos.x - 540, blob.pos.y - 320)

  if (blob.health <= 0) {
    // blob.hide();
    var blobKills = 0;
    for (var i = 0; i < blobs.length; i++) {
      if (socket.id == blobs[i].id) {
        blobKills = blobs[i].kills;
      }
    }
    fill(50);
    rect(blob.pos.x - 250, blob.pos.y - 150, 500, 300);
    fill(WHITE);
    text("You died.\nScore : " + blobKills + "\nRefresh the page to try again.", blob.pos.x, blob.pos.y);
  }

  text("Health: " + blob.getHealth(), blob.pos.x - 540, blob.pos.y + 360)

  var bullet;
  for (var i = 0; i < bullets.length; i++) {
    bullet = new Bullet(bullets[i].id, bullets[i].x, bullets[i].y, bullets[i].c, bullets[i].velx, bullets[i].vely, bullets[i].d, bullets[i].parent)
    bullet.show();
    bullet.update();
  }
}
