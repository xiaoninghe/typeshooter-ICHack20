var initialRadius = 64;
var initialHealth = 20;
var initialSpeed = 3;
var ratioAttackHealth = 0.1;
var lowerLimitOfHealthForAttack = 5;
var allWords = ["over", "let", "picture", "us", "out", "big", "world", "family", "does", "place", "try", "took", "those", "white", "like", "help", "was", "page", "they", "should", "so", "get", "one", "left", "see"];
var allNames = ["America","Balloon","Biscuit","Blanket","Chicken","Chimney","Country","Cupcake","Curtain","Diamond","Eyebrow","Fireman","Florida","Germany","Harpoon","Husband","Morning","Octopus","Popcorn","Printer","Sandbox","Skyline","Spinach"]
var words = [];
var newWordNeeded = false;
var word;
var tempword;
var typeOrBattle = false; //  spawns in battle mode
var bullets = [];

function Blob(x, y, c, kills) {
  this.pos = createVector(x, y);
  this.r = initialRadius;
  this.health = initialHealth;
  this.speed = initialSpeed;
  this.lastMoveDirection = createVector(1, 0);
  this.kills = kills
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

    socket.on('bulletheartbeat', function (data) {
      bullets = data;
    });

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
          var data1 = {
            id: idCount,
            x: this.pos.x,
            y: this.pos.y,
            c: c,
            velx: this.lastMoveDirection.x,
            vely: this.lastMoveDirection.y,
            d: this.health * ratioAttackHealth,
            parent: socket.id
          };
          socket.emit('addbullets', data1);
          idCount++;
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

    var bullet;
    for (var i = 0; i < bullets.length; i++) {
      bullet = new Bullet(bullets[i].id, bullets[i].x, bullets[i].y, bullets[i].c, bullets[i].velx, bullets[i].vely, bullets[i].d, bullets[i].parent);
      if (this.eats(bullet)) {
        print(socket.id, bullet.parent);
        if (bullet.parent !== socket.id) {
          this.damaged({d: bullet.d, parent: bullet.parent});
          socket.emit('DEAD-Bullet', bullets[i]);
        }
      }
    }

    var data = {
      x: this.pos.x,
      y: this.pos.y,
      r: this.r,
      kills: this.kills
    };
    socket.emit('update', data);
  }

  // this.respawn = function (other) {
  //   this.pos.x = random(width);
  //   this.pos.y = random(height);
  //   this.r = initialRadius;
  //   this.health = initialHealth;
  //   this.speed = initialSpeed;
  // }

  this.eats = function (other) {
    var d = p5.Vector.dist(this.pos, other.pos);
    // print(d)
    // print(this.r + other.r)
    if (d <= this.r + other.r) {
      return true;
    } else {
      return false;
    }
  }

  this.damaged = function (d) {
    if (this.health <= d.d) {
      this.health = 0;
      socket.emit('DEAD-Blob', {blob: this.id, bullet: d.parent});
      // print("test");
    } else {
      this.health -= d.d;
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
    if (this.health < 99) {
      this.health = this.health + 2;
    } else {
      this.health = 100;
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
