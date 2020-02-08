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

function Blob(x, y, c) {
  this.pos = createVector(x, y);
  this.typeOrBattle = false; //  spawns in battle mode
  this.r = initialRadius;
  this.health = initialHealth;
  this.speed = initialSpeed;
  this.lastMoveDirection = createVector(1, 0);
  for (var i = 0; i < 10; i++) {
    words[i] = allWords[int(random(allWords.length))]
  }
  word = words[0];
  tempword = words[0];

  this.update = function () {
    if (keyIsDown(9)) {
      this.typeOrBattle = !this.typeOrBattle;
    }
    if (this.typeOrBattle) {
      this.keyTyped();
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
        this.lastMoveDirection = vel;
      }
      if (keyIsDown(75) && this.health > lowerLimitOfHealthForAttack) {
        var bullet = new Bullet(this.pos.x, this.pos.y, c, this.lastMoveDirection, this.health * ratioAttackHealth);
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

  this.keyTyped = function () {
    if (key === tempword[0]) {
      tempword = tempword.substring(1, tempword.length);
      if (tempword.length == 0) {
        for (var i = 0; i < words.length - 1; i++) {
          words[i] = words[i + 1]
        }
        word = words[0]
        tempword = words[0];
        words[words.length - 1] = allWords[int(random(allWords.length))];
      }
    } else {
      tempword = word;
    }
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
