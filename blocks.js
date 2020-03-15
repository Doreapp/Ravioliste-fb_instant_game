class Block {

    constructor(canvas, offset, values, img, editer) {
        this.canvas = canvas;
        this.width = values.width * canvas.blockSize;
        this.height = values.height * canvas.blockSize;
        this.x = (values.x + offset) * canvas.blockSize;
        this.y = (8 - values.y) * canvas.blockSize;
        this.img = img;
        this.editer = editer;
        switch (values.vertical_colision) {
            case "LAND":
                this.vColision = 1;
                break;
            case "KILL":
                this.vColision = 2;
                break;
            case "GRAB":
                this.vColision = 3;
                break;
            case "DEST":
                this.vColision = 4;
                break;
            default:
                this.vColision = 0;
        }
        switch (values.horizontal_colision) {
            case "KILL":
                this.hColision = 2;
                break;
            case "GRAB":
                this.hColision = 3;
                break;
            case "DEST":
                this.hColision = 4;
                break;
            default:
                this.hColision = 0;
        }

        //console.log("<init> img = " + img);
    }

    draw() {
        this.canvas.draw(this.img, this.x, this.y, this.width, this.height);
    }

    update(speed) {
        //console.log("Block update :" + this.x +"," + this.y);
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
            if (dy < this.height) {
                if (dx >= dy) {
                    // vColision, from the top
                    //console.log("Block.colide() : [" + dx + "," + dy + "] top (" + this.x + "," + this.y + ")" +
                    //    " hitbox : " + hitbox.b + " - " + hitbox.t);
                    switch (this.vColision) {
                        case 1:
                            //TODO set that the player isn't falling or jumping
                            //TODO replace the player right above the block
                            player.stopVerticalMove(-dy);
                            hitbox.t = p.top;
                            hitbox.b = p.bottom;
                            return false; //no death
                        case 2:
                            return true; //death..
                        case 3:
                            //need to grab the thing ? 
                            this.editer.grab(this)
                            return false;
                        case 4:
                            this.editer.destroy(this);
                            return false;
                    }
                    return false;
                } else {
                    //console.log("Block.colide() : [" + dx + "," + dy + "] side 1 (" + this.x + "," + this.y + ")" +
                    //    " hitbox : " + hitbox.b + " - " + hitbox.t);
                    //h Collision : from the side
                    switch (this.hColision) {
                        case 2:
                            return true; //death..
                        case 3:
                            //need to grab the thing ? 
                            this.editer.grab(this)
                            return false;
                        case 4:
                            this.editer.destroy(this);
                            return false;
                    }
                    return false;
                }
            } else {
                dy = this.y + this.height - hitbox.t; //heigth
                if (dy > 0) {
                    if (dx >= dy) {
                        //console.log("Block.colide() : [" + dx + "," + dy + "] bottom (" + this.x + "," + this.y + ")" +
                        //    " hitbox : " + hitbox.b + " - " + hitbox.t);
                        // vColision, from the bottom
                        switch (this.vColision) {
                            case 1:
                                player.stopVerticalMove(+dy);
                                hitbox.t = p.top;
                                hitbox.b = p.bottom;
                                //TODO set that the player isn't falling or jumping
                                //TODO replace the player right above the block
                                return false; //no death
                            case 2:
                                return true; //death..
                            case 3:
                                //need to grab the thing ? 
                                this.editer.grab(this)
                                return false;
                            case 4:
                                this.editer.destroy(this);
                                return false;
                        }
                        return false;
                    } else {
                        //console.log("Block.colide() : [" + dx + "," + dy + "] side 2 (" + this.x + "," + this.y + ")" +
                        //    " hitbox : " + hitbox.b + " - " + hitbox.t);
                        //h Collision : from the side
                        switch (this.hColision) {
                            case 2:
                                return true; //death..
                            case 3:
                                //need to grab the thing ? 
                                this.editer.grab(this)
                                return false;
                            case 4:
                                this.editer.destroy(this);
                                return false;
                        }
                        return false;
                    }
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
        //console.log("isGround() : dy =" + dy +", return" + (dy >= -0.05 && dy <= 0.1));

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

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

class PatternProvider {


    constructor(imgs) {
        this.imgs = imgs;
        this.patterns = [];
        var self = this;
        //on line
        readTextFile("patterns.json", function(text) {
            //console.log(text);
            self.patterns = JSON.parse(text);
            console.log(self.patterns);
        });
    }

    onJSONLoaded(text) {
        //console.log(text);
        this.patterns = JSON.parse(text);
        console.log(this.patterns);
    }

    fulfillPattern(canvas, array, offset, editer) {
        var index = Math.floor(Math.random() * this.patterns.length);
        console.log("fullfilPattern (index=" + index + ") + ofset : " + offset);

        for (let i in this.patterns[index].blocks) {
            array.push(new Block(canvas, offset, this.patterns[index].blocks[i],
                this.imgs[this.patterns[index].blocks[i].img], editer));
        }

        return this.patterns[index].width * canvas.blockSize;
    }

    flatPattern(canvas, array, offset, length) {
        array.push(new Block(canvas, offset, {
                "x": offset,
                "y": 1,
                "width": length,
                "height": 1,
                "img": "dirt",
                "vertical_colision": "LAND",
                "horizontal_colision": "KILL"
            },
            this.imgs.dirt,
            null
        ));

        array.push(new Block(canvas, offset, {
                "x": offset,
                "y": 2,
                "width": length,
                "height": 1,
                "img": "grass",
                "vertical_colision": "LAND",
                "horizontal_colision": "KILL"
            },
            this.imgs.grass,
            null
        ));
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