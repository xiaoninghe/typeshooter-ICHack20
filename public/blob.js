var initialRadius = 64;
var initialHealth = 20;
var initialSpeed = 3;
var ratioAttackHealth = 0.1;
var lowerLimitOfHealthForAttack = 5;
var allWords = ["over", "let", "picture", "us", "out", "big", "world", "family", "does", "place", "try", "took", "those", "white", "like", "help", "was", "page", "they", "should", "so", "get", "one", "left", "see"];
var words = [];
var newWordNeeded = false;
var word;
var tempword;
var typeOrBattle = false; //  spawns in battle mode

function Blob(x, y, c) {
  this.pos = createVector(x, y);
  this.r = initialRadius;
  this.health = initialHealth;
  this.speed = initialSpeed;
  this.lastMoveDirection = createVector(1, 0);
  for (var i = 0; i < 10; i++) {
    words[i] = allWords[int(random(allWords.length))]
  }
  word = words[0];
  tempword = words[0];

  this.getMode = function() {
    return typeOrBattle;
  }

  this.update = function () {
    var velx = 0;
    var vely = 0;
    if (!typeOrBattle) {
      if (keyIsDown(38) || keyIsDown(87)) { // up or 'w'
        vely--;
      } if (keyIsDown(37) || keyIsDown(65)) { // left or 'a'
        velx--;
      } if (keyIsDown(40) || keyIsDown(83)) { // down or 's'
        vely++;
      } if (keyIsDown(39) || keyIsDown(68)) { // right or 'd'
        velx++;
      }
      if (keyIsDown(75) && this.health > lowerLimitOfHealthForAttack && !typeOrBattle) {
        if (velx != 0 || vely != 0) {
          var bullet = new Bullet(this.pos.x + velx*(this.r + 100), this.pos.y + vely*(this.r + 100), c, this.lastMoveDirection, this.health * ratioAttackHealth);
          var data1 = {
            x: this.pos.x,
            y: this.pos.y,
            c: this.c,
            v: this.v,
            d: this.d
          };
          print("test")
          socket.emit('updatebullets', data1);
          this.health--;
          // this.r = this.r * sqrt(this.health / (PI * (this.health + 1)));
          this.r = 64*sqrt(this.health/20)
          this.speed = 192 / this.r;
        }
      }
      var vel = createVector(velx, vely);
      vel.setMag(this.speed);
      this.pos.add(vel);
      if (vel != createVector(0, 0)) {
        this.lastMoveDirection = vel;
      }
    }
    var data = {
      x: this.pos.x,
      y: this.pos.y,
      r: this.r
    };
    socket.emit('update', data);
  }

  // this.getData = function() {
  //   if (keyIsDown(75) && this.health > lowerLimitOfHealthForAttack && !typeOrBattle) {
  //     if (this.velx != 0 || this.vely != 0) {
  //       var bullet = new Bullet(this.pos.x + this.velx*(this.r + 100), this.pos.y + this.vely*(this.r + 100), c, this.lastMoveDirection, this.health * ratioAttackHealth);
  //       var data1 = {
  //         x: this.pos.x,
  //         y: this.pos.y,
  //         c: this.c,
  //         v: this.v,
  //         d: this.d
  //       };
  //       // print("test")
  //       // socket.emit('updatebullets', data1);
  //       this.health--;
  //       // this.r = this.r * sqrt(this.health / (PI * (this.health + 1)));
  //       this.r = 64*sqrt(this.health/20)
  //       this.speed = 192 / this.r;
  //     }
  //     return data1;
  //   }
  // }

  this.respawn = function (other) {
    this.pos.x = random(width);
    this.pos.y = random(height);
    this.r = initialRadius;
    this.health = initialHealth;
    this.speed = initialSpeed;

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
      // this.r = this.r * sqrt(this.health / (PI * (this.health + d)));
      this.r = 64*sqrt(this.health/20)
      this.speed = 192 / this.r;
    }
  }

  this.getHealth = function() {
    return this.health;
  }

  this.show = function () {
    fill(c);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  this.constrain = function () {
    blob.pos.x = constrain(blob.pos.x, -width, width);
    blob.pos.y = constrain(blob.pos.y, -height, height);
  }

  this.incrementHealth = function() {
    if (this.health < 100) {
      this.health++;
    }
  }

  this.setRadius = function() {
    this.r = 64*sqrt(this.health/20)
  }
}

function keyTyped() {
  if (typeOrBattle) {
    if (key === tempword[0]) {
      tempword = tempword.substring(1, tempword.length);
      if (tempword.length == 0) {
        for (var i = 0; i < words.length - 1; i++) {
          words[i] = words[i + 1]
        }
        word = words[0]
        tempword = words[0];
        words[words.length - 1] = allWords[int(random(allWords.length))];
        blob.incrementHealth();
        blob.setRadius();
      }
    } else {
      tempword = word;
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    typeOrBattle = !typeOrBattle;
  }
}
