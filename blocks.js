class Block {
    constructor(canvas, x, y, img) {
        console.log("Block<init> : " + x + ", " + y);
        this.canvas = canvas
        this.size = canvas.blockSize;
        this.x = x * this.size;
        this.y = y * this.size;
        this.img = img;
    }

    draw() {
        this.canvas.draw(this.img, this.x, this.y, this.size, this.size);
    }

    update(speed) {
        //console.log("Block update : " + this.x + ", " + this.y);
        this.x -= speed;
    }

    get outside() {
        return this.x <= -this.size
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
            2, 0, 0, 0, 0, 2, 2, //6
            1, 2, 2, 0, 0, 1, 1, //7
            1, 1, 1, 0, 0, 1, 1 //8
        ];

        for (let i in patern) {
            switch (patern[i]) {
                case 1:
                    array.push(new Block(canvas, i % width + offset, Math.floor(i / width), imgs.dirt));
                    break;
                case 2:
                    array.push(new Block(canvas, i % width + offset, Math.floor(i / width), imgs.grass));
                    break;
            }
        }
    }
}