class MyCanvas {

    constructor() {
        this.canvas = document.getElementById('canvas');
        //updating canvas size :
        //this.canvas.width = window.width;
        //this.canvas.heigth = window.height;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;


        this.ctx = this.canvas.getContext('2d');
        this.cHeight = this.canvas.height;
        this.cWidth = this.canvas.width;

        this.blockSize = 10;
        this.gWidth = 6 * this.blockSize;
        this.scaleToReal = this.cWidth / this.gWidth;
        this.gHeight = this.gWidth * this.cHeight / this.cWidth;
    }

    draw(img, x, y, width, height) {
        this.ctx.drawImage(img, x * this.scaleToReal, y * this.scaleToReal, width * this.scaleToReal, height * this.scaleToReal);
    }

    drawSprite(img, x, y, width, height, fx, fy, fWidth, fHeight) {
        this.ctx.drawImage(img, fx, fy, fWidth, fHeight,
            x * this.scaleToReal, y * this.scaleToReal,
            width * this.scaleToReal, height * this.scaleToReal);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
    }
}

//======================================================= Asset pre-loader object. Loads all images
// Source : https://github.com/straker/endless-runner-html5-game/blob/master/part2/kandi.js
var assetLoader = (function() {
    // images dictionary
    this.imgs = {
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
            init();
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


//======================================================= GLOBAL FUNCTIONS

function downloadAssets() {
    assetLoader.downloadAll();
}

//Variables
var canvas;
var started = false;

function init() {
    if (started)
        return; //The game have already started
    started = true;

    //init var
    canvas = new MyCanvas();
    background.reset();

    //Finally : start the game
    animate();
}

/**
 * Request Animation Polyfill
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
        requestAnimFrame(animate);
        canvas.clear();

        background.draw();

        // update entities
        //updateWater();
        //updateEnvironment();
        //updatePlayer();
        //updateGround();
        //updateEnemies();

        // draw the score TODO
        //canvas.ctx.fillText('Score: ' + score, 20, 20);
    }
}