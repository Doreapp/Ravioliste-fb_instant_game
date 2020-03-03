class Block {

    /**
     * 
     * @param {MyCanvas} canvas 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {*} img 
     */
    constructor(canvas, x, y, width, height, img) {
        console.log("Block<init> : " + x + ", " + y);
        this.canvas = canvas
        this.width = width * canvas.blockSize;
        this.height = height * canvas.blockSize;
        this.x = x * canvas.blockSize;
        this.y = y * canvas.blockSize;
        this.img = img;
        this.vColision = 1;
        this.hColision = true;

        this.touched = false;
    }

    /**
     * 
     * @param {number} vColision 
     * @param {boolean} hColision 
     */
    set(vColision, hColision) {
        this.vColision = vColision;
        this.hColision = hColision;
        // 0 rien       1 stop vertical mvmt        2 dead
    }

    draw() {
        if (this.touched) {
            this.canvas.drawRect(new Rect(this.x, this.y, this.x + this.width, this.y + this.height), "#0000b0");
            //touched = false;
            return;
        }
        this.canvas.draw(this.img, this.x, this.y, this.width, this.height);
    }

    update(speed) {
        //console.log("Block update : " + this.x + ", " + this.y);
        this.x -= speed;
    }

    get outside() {
        return this.x <= -this.width
    }

    mayCollide(hitbox) {
        if (hitbox.l > this.x + this.width) { //the player has past this block already
            return false;
        }

        var dx = hitbox.r - this.x;
        if (dx <= 0) { //the player hasn't reach this block yet
            return false;
        }

        return true;
    }

    /**
     * TODO vérifier tout ça...
     * @param {Player} p 
     * @param {Rect} hitbox 
     */
    collide(p, hitbox) {
        //assert(mayCollide(hitbox))

        var dx = hitbox.r - this.x;

        var dy = hitbox.b - this.y; //if the player come from the top
        if (dy > 0) {
            if (dy < this.height) { //TODO change to height
                if (dx >= dy) {
                    // vColision, from the top
                    console.log("Block.colide() : [" + dx + "," + dy + "] top (" + this.x + "," + this.y + ")");
                    switch (this.vColision) {
                        case 0:
                            return false;
                        case 1:
                            //TODO set that the player isn't falling or jumping
                            //TODO replace the player right above the block
                            player.stopVerticalMove(-dy);
                            return false; //no death
                        case 2:
                            return true; //death..
                    }
                } else {
                    console.log("Block.colide() : [" + dx + "," + dy + "] side 1 (" + this.x + "," + this.y + ")");
                    //h Collision : from the side
                    return this.hColision;
                }
                this.touched = true;
            } else {
                dy = this.y + this.height - hitbox.t; //heigth
                if (dy > 0) {
                    if (dx >= dy) {
                        console.log("Block.colide() : [" + dx + "," + dy + "] bottom (" + this.x + "," + this.y + ")");
                        // vColision, from the bottom
                        switch (this.vColision) {
                            case 0:
                                return false;
                            case 1:
                                player.stopVerticalMove(+dy);
                                //TODO set that the player isn't falling or jumping
                                //TODO replace the player right above the block
                                return false; //no death
                            case 2:
                                return true; //death..
                        }
                    } else {
                        console.log("Block.colide() : [" + dx + "," + dy + "] side 2 (" + this.x + "," + this.y + ")");
                        //h Collision : from the side
                        return this.hColision;
                    }
                    this.touched = true;
                }
            }
        }
        return false;
    }

    isGround(hitbox) {
        if (this.vColision != 1) {
            return false; //cannot be ground if kill the player of let him go through
        }

        //assert(mayCollide(hitbox));

        var dy = this.y - hitbox.b;
        //console.log("isGround() : dy = " + dy + ", return " + (dy >= -0.05 && dy <= 0.1));

        return (dy >= -0.05 && dy <= 0.1);
    }
}

class Patern {
    constructor(imgs) {
        this.imgs = imgs;
    }

    fulfill(canvas, array, offset) {
        var width = 7;
        var patern = [
            0, 0, 0, 0, 0, 0, 0, //1
            0, 0, 0, 0, 0, 0, 0, //2
            0, 0, 0, 0, 0, 0, 0, //3
            0, 0, 0, 0, 0, 0, 0, //4
            0, 0, 0, 0, 0, 0, 0, //5
            2, 2, 2, 2, 2, 2, 2, //6
            1, 1, 1, 1, 1, 1, 1, //7
            1, 1, 1, 1, 1, 1, 1 //8
        ];

        for (let i in patern) {
            switch (patern[i]) {
                case 1:
                    array.push(new Block(canvas, i % width + offset, Math.floor(i / width), 1, 1, imgs.dirt));
                    break;
                case 2:
                    array.push(new Block(canvas, i % width + offset, Math.floor(i / width), 1, 1, imgs.grass));
                    break;
            }
        }
    }
}

class Rect {
    /*
                right               left
    top         ====================
                ====================
    bottom      ====================            
    */


    constructor(left, top, right, bottom) {
        this.l = left;
        this.t = top;
        this.r = right;
        this.b = bottom;
    }
}