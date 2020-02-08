var blob;
var socket;
var blobs = [];
var bullets = [];
var allWords = ["over","let","picture","us","out","big","world","family","does","place","try","took","those","white","like","help","was","page","they","should","so","get","one","left","see"];
var words = [];
var newWordNeeded = false;
var word;
var tempword;

function setup() {
  // put setup code here
  createCanvas(1000, 540);
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
  for (var i = 0; i < 10; i++) {
    words[i] = allWords[int(random(allWords.length))]
  }
  word = words[0];
  tempword = words[0];
}



function keyTyped() {
  if (key === tempword[0]) {
    tempword = tempword.substring(1,tempword.length);
    if (tempword.length == 0) {
      for (var i = 0; i < words.length-1; i++) {
        words[i] = words[i+1]
      }
      word = words[0]
      tempword = words[0];
      words[words.length-1] = allWords[int(random(allWords.length))];
    }
  } else {
    tempword = word;
  }
}

function draw() {
  background(255);

  translate(width/2, height/2);
  scale(blob.r / 64);
  translate(-blob.pos.x-100, -blob.pos.y);
  for (var x = -1.5*width; x < 1.5*width; x += 250) {
    stroke(200);
    strokeWeight(1);
    line(x, -1.5*height, x, 1.5*height);
  }
	for (var y = -1.5*height; y < 1.5*height; y += 250) {
		stroke(200);
		strokeWeight(1);
		line(-2*width, y, 2*width, y);
	}

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

  fill(255);
  rect(blob.pos.x+400,blob.pos.y-275,210,550);

  fill(0);
  textSize(20);
  for (var i = 0; i < 10; i++) {
    if (i == 0) {
      text(words[i],blob.pos.x+425,blob.pos.y-235+i*20)
    } else {
      text(words[i],blob.pos.x+425,blob.pos.y-220+i*20)
    }
  }

  for (var i = 0; i < bullets.length; i++) {
    bullets[i].update();
  }
}
