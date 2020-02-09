
var range = 10000;
var size = 8;
var speed = 10;

function Bullet(id, x, y, c, velx, vely, d, parent) {
    this.id = id;
    this.pos = createVector(x, y);
    this.dire = createVector(velx, vely).setMag(speed);
    this.travelled = 0
    this.d = d;
    this.r = size;
    this.parent = parent;

    this.show = function () {
        fill(c);
        ellipse(this.pos.x, this.pos.y, size*2, size*2);
    }

    this.update = function () {
        // if (this.travelled >= range) {
        //     socket.emit('DEAD-Bullet', this);
        // } else {
          this.pos.add(this.dire);
          var data = {
            id: this.id,
            x: this.pos.x,
            y: this.pos.y,
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
            // this.travelled++;
        // }
    }
}
