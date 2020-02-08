function Blob(x, y, r) {
  this.pos = createVector(x,y);
  this.r = r;



  this.update = function() {
    var velx;
    var vely;
    if (keyIsDown(38)) { // up
      vely = -1;
    } if (keyIsDown(37)) { // left
      velx = -1;
    } if (keyIsDown(40)) { // down
      vely = 1;
    } if (keyIsDown(39)) { // right
      velx = 1;
    }
    var vel = createVector(velx, vely);
    vel.setMag(3);
    this.pos.add(vel);
    var data = {
      x: this.pos.x,
      y: this.pos.y,
      r: this.r
    };
    socket.emit('update', data);
  }

  this.eats = function(other) {
    var d = p5.Vector.dist(this.pos, other.pos);
    if (d < this.r + other.r) {
      this.r += other.r;
      return true;
    } else {
      return false;
    }
  }

  this.show = function() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
  }

  this.constrain = function() {
    blob.pos.x = constrain(blob.pos.x, -width, width);
    blob.pos.y = constrain(blob.pos.y, -height, height);
  }
}
