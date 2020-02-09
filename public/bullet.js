var blobs = [];
var range = 12345;
var size = 8;
var speed = 10;

function Bullet(x, y, c, v, d) {
    this.pos = createVector(x, y);
    this.dire = v.setMag(speed);
    this.travelled = 0

    this.show = function () {
        fill(c);
        rect(this.pos.x, this.pos.y, size, size);
    }

    this.update = function () {
        if (this.travelled >= range) {
            socket.emit('DEAD-Bullet', this);
        } else {
            this.pos.add(this.dire);
            socket.on('heartbeat',
                function (data) {
                    blobs = data;
                }
            );
            for (var i = 0; i < blobs.length; i++) {
                if (blobs[i].eats(this)) {
                    blobs[i].damaged(d);
                    socket.emit('DEAD-Bullet', this);
                }
            }
            this.travelled++;
        }
    }
}
