let particles = [];
function setup() {
    sketchWidth = document.body.clientWidth;
    sketchHeight = document.body.clientHeight;
    createCanvas(sketchWidth, sketchHeight);

    for (let i = 0; i < 60; i++) {
        particles[particles.length] = new sprite(random(0, width), random(0, height), random(-10, 10), random(0, 10), random(0, 360));
    }

    angleMode(DEGREES);
}

function draw() {
    clear();
    if (particles.length < 80) {
        particles[particles.length] = new sprite(random(0, width), random(0, height), random(-10, 10), random(0, 10), random(0, 360));
    }
    for (let i = 0; i < particles.length; i += 1) {
        if (particles[i] != undefined) {
            particles[i].draw();
            if (particles[i].y < 0 || particles[i].y > windowHeight || particles[i].x < 0 || particles[i].x > windowWidth) {
                delete particles[i];
            }
        }
        else {
            particles[i] = new sprite(random(0, width), random(0, height), random(-10, 10), random(0, 10), random(0, 360));
        }
    }
}

// Add a new boid into the System
function mouseDragged() {
    for (let i = 0; i < 2; i++) {
        particles.push(new sprite(mouseX, mouseY, random(-10, 10), random(0, 10), random(0, 360)));
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class sprite {
    constructor(x, y, xspeed, yspeed, rotation) {
        this.x = x;
        this.y = y;
        this.xspeed = xspeed;
        this.yspeed = yspeed;
        this.rotation = rotation;
    }
    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);

        stroke(77, 112, 0, 200);
        fill(107, 142, 35, 100);

        ellipse(0, 0, 26, 10);
        line(-13, 0, 13, 0);
        this.x += this.xspeed;
        this.y += this.yspeed;
        this.rotation += 10;
        pop();
    }
}
