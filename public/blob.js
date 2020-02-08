function Blob(x, y, r) {
  this.pos = createVector(x, y);
  this.typeOrBattle = false;
  this.r = 64;
  this.health = 20;
  this.speed = 3;

  this.update = function () {
    if (typeOrBattle) {








    } else {
      var velx = 0;
      var vely = 0;
      if (keyIsDown(38) || keyIsDown(87)) { // up or 'w'
        vely--;
      } if (keyIsDown(37) || keyIsDown(65)) { // left or 'a'
        velx--;
      } if (keyIsDown(40) || keyIsDown(83)) { // down or 's'
        vely++;
      } if (keyIsDown(39) || keyIsDown(68)) { // right or 'd'
        velx++;
      }
      var vel = createVector(velx, vely);
      vel.setMag(speed);
      this.pos.add(vel);
      if (keyIsDown(75) && this.health > 5) {
        var bullet = new Bullet(this.pos.x, this.pos.y, c, vel);
        socket.emit('bullets', bullet);
        this.health--;
        r = sqrt(health / PI * (health + 1));
        speed = 192 / r;
      }
    }
    var data = {
      x: this.pos.x,
      y: this.pos.y,
      r: this.r
    };
    socket.emit('update', data);
  }

  this.eats = function (other) {
    var d = p5.Vector.dist(this.pos, other.pos);
    if (d < this.r + other.r) {
      this.r += other.r;
      return true;
    } else {
      return false;
    }
  }

  this.damaged = function () {
    if (this.health = 1) {
      socket.emit('DEAD-Blob', this);
    } else {
      this.health--;
      r = sqrt(health / PI * (health + 1));
      speed = 192 / r;
    }
  }

  this.show = function () {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  this.constrain = function () {
    blob.pos.x = constrain(blob.pos.x, -width, width);
    blob.pos.y = constrain(blob.pos.y, -height, height);
  }
}
