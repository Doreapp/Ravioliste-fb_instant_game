//================================================================== MyCanvas
/**
 * Personnal class that manage the canvas to draw on
 * Adapt to the right size 3:4 
 * Draw the object placed into the game space by scaling their position+dimensions
 */
class MyCanvas {
    /*
     * Game space : 
     * The screen is 4:3 
     * The draw grid is 8:6 
     */

    constructor() {
        //get the canvas object
        this.canvas = document.getElementById('canvas');

        //update the canvas size :
        var h = window.innerHeight;
        var w = window.innerWidth;
        this.topOffset = 0; //invariant sky place above the canvas
        if (h * 3 >= w * 4) {
            //Screen to hight:
            this.topOffset = Math.max(0, h - 4 * w / 3); // 0 min (not really needed)
        } else {
            //Screen to large
            w = 3 * h / 4; //limit the width
        }
        //Then, actually change the canvas object dimensions
        this.canvas.width = w;
        this.canvas.height = h;

        // Getting values:
        this.ctx = this.canvas.getContext('2d');
        this.cHeight = h;
        this.cWidth = w;

        // Setting game values : 
        this.blockSize = 10;
        this.gWidth = 6 * this.blockSize;
        this.scaleToReal = this.cWidth / this.gWidth;
        this.gHeight = this.gWidth * this.cHeight / this.cWidth;
    }

    /**
     * draw the image, scaled from the game space to the screen dimensions
     * @param {CanvasImageSource} img image to draw
     * @param {number} x position where to draw
     * @param {number} y position where to drw
     * @param {number} width size of the image 
     * @param {number} height size of the image
     */
    draw(img, x, y, width, height) {
        this.ctx.drawImage(img, x * this.scaleToReal, this.topOffset + y * this.scaleToReal, width * this.scaleToReal, height * this.scaleToReal);
    }

    /**
     * Draw a frame of the sprite
     * @param CanvasImageSource} img sprite image
     * @param {number} x coordinate where to draw 
     * @param {number} y coordinate where to draw
     * @param {number} width size of the image 
     * @param {number} height size of the image 
     * @param {number} fx frame coordinate in sprite
     * @param {number} fy  frame coordinate in sprite
     * @param {number} fWidth frame width
     * @param {number} fHeight frame height
     */
    drawSprite(img, x, y, width, height, fx, fy, fWidth, fHeight) {
        this.ctx.drawImage(img, fx, fy, fWidth, fHeight,
            x * this.scaleToReal, this.topOffset + y * this.scaleToReal,
            width * this.scaleToReal, height * this.scaleToReal);
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
        if (this.topOffset > 0) {
            //draw a rect above the used canvas
            this.ctx.fillStyle = "#CCFFFF"; //sky color
            this.ctx.fillRect(0, 0, this.cWidth, this.topOffset);
        }
    }
}

//======================================================= Asset pre-loader object. Loads all images
// Source : https://github.com/straker/endless-runner-html5-game/blob/master/part2/kandi.js
var assetLoader = (function() {
    // images dictionary
    this.imgs = {
        'dirt': 'assets/dirt.png',
        'grass': 'assets/grass.png',
        'logo': 'assets/logo.png',
        'sky': 'assets/sky.png',
        'bg': 'assets/bg.png',
        'backdrop': 'assets/backdrop.png'
    };

    var assetsLoaded = 0; // how many assets have been loaded
    var numImgs = Object.keys(this.imgs).length; // total number of image assets
    this.totalAssest = numImgs; // total number of assets

    /**
     * Ensure all assets are loaded before using them
     * @param {number} dic  - Dictionary name ('imgs', 'sounds', 'fonts')
     * @param {number} name - Asset name in the dictionary
     */
    function assetLoaded(dic, name) {
        console.log("assetLoaded");
        // don't count assets that have already loaded
        if (this[dic][name].status !== 'loading') {
            return;
        }

        this[dic][name].status = 'loaded';
        assetsLoaded++;

        // finished callback
        if (assetsLoaded === this.totalAssest) {
            console.log("all assets Loaded");
            //init();
        }
    }

    /**
     * Create assets, set callback for asset loading, set asset source
     */
    this.downloadAll = function() {
        console.log("downloadAll()");
        var _this = this;
        var src;

        // load images
        for (var img in this.imgs) {
            if (this.imgs.hasOwnProperty(img)) {
                src = this.imgs[img];

                // create a closure for event binding
                (function(_this, img) {
                    _this.imgs[img] = new Image();
                    _this.imgs[img].status = 'loading';
                    _this.imgs[img].name = img;
                    _this.imgs[img].onload = function() { assetLoaded.call(_this, 'imgs', img) };
                    _this.imgs[img].src = src;
                })(_this, img);
            }
        }
    }

    return {
        imgs: this.imgs,
        totalAssest: this.totalAssest,
        downloadAll: this.downloadAll
    };
})();

/**
 * ========================================================================== Creates a Spritesheet
 * @param {string} - Path to the image.
 * @param {number} - Width (in px) of each frame.
 * @param {number} - Height (in px) of each frame.
 */
function SpriteSheet(path, frameWidth, frameHeight) {
    this.image = new Image();
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;

    // calculate the number of frames in a row after the image loads
    var self = this;
    this.image.onload = function() {
        self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
    };

    this.image.src = path;
    console.log("SpriteSheet<init>() : path = " + path + ", img = " + this.image);
}

/**
 * Creates an animation from a spritesheet.
 * @param {SpriteSheet} - The spritesheet used to create the animation.
 * @param {number}      - Number of frames to wait for before transitioning the animation.
 * @param {array}       - Range or sequence of frame numbers for the animation.
 * @param {boolean}     - Repeat the animation once completed.
 */
function Animation(spritesheet, frameSpeed, startFrame, endFrame) {

    var animationSequence = []; // array holding the order of the animation
    var currentFrame = 0; // the current frame to draw
    var counter = 0; // keep track of frame rate

    // start and end range for frames
    for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
        animationSequence.push(frameNumber);

    /**
     * Update the animation
     */
    this.update = function() {

        // update to the next frame if it is time
        if (counter == (frameSpeed - 1))
            currentFrame = (currentFrame + 1) % animationSequence.length;

        // update the counter
        counter = (counter + 1) % frameSpeed;
    };

    /**
     * Draw the current frame
     * @param {integer} x - X position to draw
     * @param {integer} y - Y position to draw
     */
    this.draw = function(x, y, width, height) {
        // get the row and col of the frame
        var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
        var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);

        canvas.drawSprite(
            spritesheet.image,
            x, y,
            width, height,
            col * spritesheet.frameWidth, row * spritesheet.frameHeight,
            spritesheet.frameWidth, spritesheet.frameHeight,
        );
    };
}

// ============================================================ Player 
var player = (function() {
    var x, y; //game coordinate (x constant)
    var width, height; //game dimensions 1x1.5
    var runAnim, jumpAnim, fallAnim; //animations
    var currentAnim; //current drawn animation

    this.reset = function(blockSize) {
        console.log("Player init");

        //Position
        x = blockSize * 2;
        y = blockSize * 5;

        //Dimensions
        width = blockSize;
        height = 1.5 * blockSize;

        //Animations (running, jumping, falling)
        var sprite = new SpriteSheet('assets/player.png', 100, 150);
        runAnim = new Animation(sprite, 3, 0, 11);
        jumpAnim = new Animation(sprite, 4, 3, 3);
        fallAnim = new Animation(sprite, 4, 1, 1);

        //shown animation : currently running
        currentAnim = runAnim;
    }

    //Draw the player
    this.draw = function() {
        //Draw the current animation
        currentAnim.draw(x, y, width, height);
    }

    //Update the player
    this.update = function() {
        //update the animation
        currentAnim.update();

        //TODO manage y speed and gravity
    }

    //Ask the player to jumpe
    this.jump = function() {
        //TODO
        // add a var 'jumping' etc
    }

    return {
        draw: this.draw,
        reset: this.reset,
        update: this.update,
        jump: this.jump
    }
})();

/**
 * ============================================================ Background
 */
var background = (function() {
    var sky = {};
    var backdrop = {};

    /**
     * Draw the backgrounds to the screen at different speeds
     */
    this.draw = function() {
        var bgHeight = canvas.cHeight / canvas.scaleToReal;
        var bgWidth = bgHeight * 10 / 8
        canvas.draw(assetLoader.imgs.bg, 0, 0, bgWidth, bgHeight);
        canvas.ctx.drawImage(assetLoader.imgs.bg, 0, 0);

        // Pan background
        sky.x -= sky.speed;
        backdrop.x -= backdrop.speed;

        // draw images side by side to loop
        canvas.draw(assetLoader.imgs.sky, sky.x, 0, bgWidth, bgHeight);
        canvas.draw(assetLoader.imgs.sky, sky.x + bgWidth, 0, bgWidth, bgHeight);

        canvas.draw(assetLoader.imgs.backdrop, backdrop.x, 0, bgWidth, bgHeight);
        canvas.draw(assetLoader.imgs.backdrop, backdrop.x + bgWidth, 0, bgWidth, bgHeight);


        // If the image scrolled off the screen, reset
        if (sky.x + bgWidth <= 0)
            sky.x = 0;
        if (backdrop.x + bgWidth <= 0)
            backdrop.x = 0;
    };

    /**
     * Reset background to zero
     */
    this.reset = function() {
        sky.x = 0;
        sky.y = 0;
        sky.speed = 0.2;

        backdrop.x = 0;
        backdrop.y = 0;
        backdrop.speed = 0.4;
    }

    return {
        draw: this.draw,
        reset: this.reset
    };
})();

//============================================================= environement
var environement = (function() {
    //Manage all the blocks 
    var blocks = [];

    // reset the environnement (init)
    this.reset = function() {
        //see Patern class into block.js file
        var p = new Patern(assetLoader.imgs);
        p.fulfill(canvas, blocks, 5);
        p.fulfill(canvas, blocks, 12);
        p.fulfill(canvas, blocks, 19);
    }

    // update the environnement 
    //@param {number} speed : the speed of the player
    this.update = function(speed) {
        var length = blocks.length;
        for (let i = 0; i < length; i++) {
            blocks[i].update(speed);
            if (blocks[i].outside) {
                blocks.splice(i, 1);
                i--;
                length--;
            }
        }
    }

    //draw the environnement
    this.draw = function() {
        for (let i in blocks) {
            blocks[i].draw(canvas);
        }
    }


    return {
        update: this.update,
        reset: this.reset,
        draw: this.draw
    };
})();


//======================================================= GLOBAL FUNCTIONS

// download global assets
function downloadAssets() {
    assetLoader.downloadAll();
}

//Variables
var canvas;
var started = false;

//Really start the game
function startGame() {
    console.log("startGame()");
    if (started)
        return; //The game have already started
    started = true;

    // /!\ Only for offline test
    downloadAssets();

    //init variables
    canvas = new MyCanvas();
    background.reset();
    player.reset(canvas.blockSize);
    environement.reset();

    console.log("var inited, launch game");

    //Finally : start the game
    animate();
}

/**
 * Request Animation Polyfill (updaete what's drawn)
 */
var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
 * Game loop
 */
function animate() {
    if (started) {
        //console.log("animate()");

        //1 update 
        player.update();
        environement.update(0.6);

        //2 check collisins (TODO)

        //3 draw game 
        requestAnimFrame(animate);
        canvas.clear();

        background.draw(); //(update and draw)
        environement.draw();
        player.draw();

        // draw the score TODO
        //canvas.ctx.fillText('Score: ' + score, 20, 20);
    }
}