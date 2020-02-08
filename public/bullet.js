var blobs = [];
var range = 5;

function Bullet(x, y, c, d) {
    this.pos = createVector(x, y);
    this.s = 8;
    this.speed = 10;
    this.dire = d.setMag(speed);
    this.travelled = 0

    this.show() = function () {
        fill(c);
        fillRect(this.pos.x, this.pos.y, s, s);
    }

    this.update = function () {
        if (this.travelled > 4) {
            socket.emit('DEAD-Bullet', this);
        } else {
            this.pos.add(dire);
            socket.on('heartbeat',
                function (data) {
                    blobs = data;
                }
            );
            for (var i = 0; i < blobs.length; i++) {
                if (blobs[i].eats(this)) {
                    blobs[i].damaged();
                    socket.emit('DEAD-Bullet', this);
                }
            }
            travelled++;
        }
    }
}