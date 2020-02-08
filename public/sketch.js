var blob;
var socket;
var blobs = [];

function setup() {
  // put setup code here
  createCanvas(600, 600);
  socket = io.connect('http://localhost:3000');
  blob = new Blob(random(width), random(height), 64);

  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  };
  socket.emit('start', data);
  socket.on('heartbeat',
    function(data) {
      blobs = data;
    }
  );
}

function draw() {
  background(0);
  translate(width/2-blob.pos.x, height/2-blob.pos.y);
  for (var i = blobs.length-1; i >= 0; i--) {
    if (blobs[i].id !== socket.id) {
      fill(0, 0, 255);
      ellipse(blobs[i].x, blobs[i].y, blobs[i].r*2, blobs[i].r*2);

      fill(255);
      textAlign(CENTER);
      text(blobs[i].id, blobs[i].x, blobs[i].y + blobs[i].r*1.5);
    }
  //   blobs[i].show();
  //   if (blob.eats(blobs[i])) {
  //     blobs.splice(i, 1);
  //   }
  }
  blob.show();
  blob.update();
  blob.constrain();
}
