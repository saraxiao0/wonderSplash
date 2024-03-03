var d = [];

function setup() {
    sketchWidth = document.body.clientWidth;
    sketchHeight = document.body.clientHeight;
    createCanvas(sketchWidth, sketchHeight);

    for (var i = 0; i < 100; i++) {
        d.push(new Drop(random(0, windowWidth), random(0, windowHeight), random(2, 4)));
    }
}

function draw() {
    clear();
    for (var i = 0; i < d.length; i++) {
        d[i].displ();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function Drop(x, y, sp) {
    var x1 = x;
    var y1 = y;
    var x2;
    var y2;
    var s = sp;

    this.displ = function () {
        var mx = map(mouseX, 0, width, 7, 14);

        y1 = y1 + s * mx;
        x2 = x1;
        y2 = y1 + 50;

        stroke(200);
        line(x1, y1, x2, y2);

        // if (y1 >= windowHeight - 100) {
        if (y1 >= windowHeight) {
            /*
            noFill();
            stroke(200);
            ellipse(x1, windowHeight - random(50, 70), random(25, 100), 10);
            */

            x1 = random(0, windowWidth);
            y1 = -120;
        }
    };
}
