var size = 8;
var speed = 64;

function Bullet(id, x, y, c, velx, vely, d, parent, travelled) {
    this.id = id;
    this.pos = createVector(x, y);
    this.dire = createVector(velx, vely).setMag(speed);
    this.travelled = travelled;
    this.d = d;
    this.r = size;
    this.parent = parent;

    this.show = function () {
      fill(c);
      ellipse(this.pos.x, this.pos.y, size*2, size*2);
    }

    this.update = function () {
      this.pos.add(this.dire);
      var data = {
        id: this.id,
        x: this.pos.x,
        y: this.pos.y,
        travelled: this.travelled + 1,
      };
      socket.emit('updatebullets', data);
          // socket.on('heartbeat',
          //     function (data) {
          //         blobs1 = data;
          //     }
          // );
          // for (var i = 0; i < blobs.length; i++) {
          //   print(blob.pos.x);
          //     if (blobs[i].eats(this)) {
          //         blobs[i].damaged(d);
          //         socket.emit('DEAD-Bullet', this);
          //     }
          // }

    }
}
