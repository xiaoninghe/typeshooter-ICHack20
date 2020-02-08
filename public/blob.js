var initialRadius = 64;
var initialHealth = 20;
var initialSpeed = 3;
var ratioAttackHealth = 0.1;
var lowerLimitOfHealthForAttack = 5;
var lastMoveDirection = createVector(1, 0);

function Blob(x, y, c) {
  this.pos = createVector(x, y);
  this.typeOrBattle = false; //  spawns in battle mode
  this.r = initialRadius;
  this.health = initialHealth;
  this.speed = initialSpeed;

  this.update = function () {
    if (keyIsDown(9)) {
      this.typeOrBattle = !this.typeOrBattle;
    }
    if (this.typeOrBattle) {
////////////////////////////////////////////////////////////
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
      vel.setMag(this.speed);
      this.pos.add(vel);
      if (vel != createVector(0, 0)) {
        lastMoveDirection = vel;
      }
      if (keyIsDown(75) && this.health > lowerLimitOfHealthForAttack) {
        var bullet = new Bullet(this.pos.x, this.pos.y, c, lastMoveDirection, this.health * ratioAttackHealth);
        socket.emit('bullets', bullet);
        this.health--;
        this.r = sqrt(this.health / PI * (this.health + 1));
        this.speed = 192 / this.r;
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

  this.damaged = function (d) {
    if (this.health <= d) {
      socket.emit('DEAD-Blob', this);
    } else {
      this.health -= d;
      this.r = sqrt(this.health / PI * (this.health + d));
      this.speed = 192 / this.r;
    }
  }

  this.show = function () {
    fill(c);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  this.constrain = function () {
    blob.pos.x = constrain(blob.pos.x, -width, width);
    blob.pos.y = constrain(blob.pos.y, -height, height);
  }
}
