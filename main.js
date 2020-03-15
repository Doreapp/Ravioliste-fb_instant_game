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
        this.ctx.drawImage(img, x * this.scaleToReal, this.topOffset + y * this.scaleToReal,
            width * this.scaleToReal, height * this.scaleToReal);
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

    drawScore(score) {
        this.ctx.font = this.cWidth / 25 + "px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Score: " + score, this.cWidth / 25, this.cWidth / 12);
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

    /**
     * 
     * @param {Rect} rect 
     * @param {colorString} color 
     */
    drawRect(rect, color) {
        this.ctx.fillStyle = color; //sky color
        this.ctx.fillRect(rect.l * this.scaleToReal, this.topOffset + rect.t * this.scaleToReal,
            (rect.r - rect.l) * this.scaleToReal,
            (rect.b - rect.t) * this.scaleToReal);
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
        'backdrop': 'assets/backdrop.png',
        'ravioli': 'assets/ravioli_couleur.png',
        'rhino': 'assets/rhino.png',
        'barbecue': 'assets/barbecue.png',
        'coffee': 'assets/coffee.png',
        'burger': 'assets/burger.png',
        'linux': 'assets/linux.png',
        'sofa': 'assets/sofa.png',
        'sumo': 'assets/sumo.png',
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
    //console.log("SpriteSheet<init>() : path =" + path + ", img =" + this.image);
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
class Player {
    //var x, y; //game coordinate (x constant)
    //var width, height; //game dimensions 1x1.5
    //var runAnim, jumpAnim, fallAnim; //animations
    //var currentAnim; //current drawn animation
    constructor(blockSize) {
        //console.log("Player<init>");

        //Position
        this.x = blockSize * 2;
        this.y = blockSize * 2.55;
        this.advencment = 0;
        this.deltaX = 0.15 * blockSize;
        this.deltaY = 0.04 * blockSize;
        this.gravity = 0.2;
        this.speedY = 0;
        this.falling = false;
        this.jumpSpeed = 3.7;

        //Dimensions
        this.width = blockSize;
        this.height = 1.5 * blockSize;

        //Animations (running, jumping, falling)
        var sprite = new SpriteSheet('assets/player2.png', 102, 113);
        this.runAnim = new Animation(sprite, 2, 0, 9);
        this.jumpAnim = new Animation(sprite, 4, 3, 3);
        //this.fallAnim = new Animation(sprite, 4, 1, 1);

        //shown animation : currently running
        this.currentAnim = this.runAnim;
        this.wantsToJump = false;
    }

    //Draw the player
    draw() {
        //Draw the current animation

        this.currentAnim.draw(this.x, this.y, this.width, this.height);
    }

    //Update the player
    update() {
        //update the animation
        this.currentAnim.update();

        if (this.falling) {
            this.y += this.speedY;
            this.speedY += this.gravity;
        }

        return this.y <= 8 * this.width; //trick : game height = 8*bs, this.width = bs...
        //TODO manage y speed and gravity
    }

    stopVerticalMove(dy) {
        if (dy == 0 && this.speedY == -this.jumpSpeed)
            return;
        console.log("stopVerticalMove(" + dy + ")");
        //console.log("stopVerticalMove(" + dy + ") curr " + this.y);
        this.y += dy;
        //console.log("stopVerticalMove(" + dy + ") new " + this.y);
        this.falling = false;
        this.speedY = 0;
        this.currentAnim = this.runAnim;

        if (this.wantsToJump) {
            console.log("his wants to jump is joined");
            this.jump();
        }
    }

    //Ask the player to jumpe
    jump() {
        if (!started)
            return;

        if (this.falling) {
            console.log("wants to jump");
            this.wantsToJump = true;
            return;
        }
        this.wantsToJump = false;
        //console.log("Player.jump()");
        //TODO
        // add a var 'jumping' etc

        console.log("jump really");
        this.falling = true;
        this.currentAnim = this.jumpAnim;
        this.speedY = -this.jumpSpeed;
    }

    get left() {
        return this.x + this.deltaX;
    }

    get right() {
        return this.x + this.width - this.deltaX;
    }

    get top() {
        return this.y + this.deltaY;
    }

    get bottom() {
        return this.y + this.height - this.deltaY;
    }

    get hitbox() {
        return new Rect(this.left, this.top, this.right, this.bottom);
    }
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
        canvas.draw(assetLoader.imgs.sky, sky.x, 0, 120, 80);
        canvas.draw(assetLoader.imgs.sky, sky.x + 120, 0, 120, 80);

        canvas.draw(assetLoader.imgs.backdrop, backdrop.x, 0, 400, 80);
        canvas.draw(assetLoader.imgs.backdrop, backdrop.x + 400, 0, 400, 80);


        // If the image scrolled off the screen, reset
        if (sky.x + 120 <= 0)
            sky.x = 0;
        if (backdrop.x + 400 <= 0)
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

var score;

//============================================================= environement
var environement = (function() {
    //Manage all the blocks 
    var blocks = [];

    var end = 0;

    this.destroy = function destroyObject(object) {
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i] === object) {
                blocks.splice(i, 1);
                break;
            }
        }
    }

    this.grab = function grabObject(object) {
        destroy(object)

        score += 1000;
    }

    var editer = {
        destroy: this.destroy,
        grab: this.grab
    }





    // reset the environnement (init)
    this.reset = function() {
        //see Patern class into block.js file
        blocks = [];
        end = 8 * canvas.blockSize;;
        patternProvider.flatPattern(canvas, blocks, 0, 8);
        addPattern();
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
        end -= speed;
        if (end <= 9 * canvas.blockSize) {
            addPattern();
        }
    }

    this.addPattern = function() {
        while (end <= 9 * canvas.blockSize) {
            var added = patternProvider.fulfillPattern(canvas, blocks, end / canvas.blockSize, editer);
            end = end + added;
            //console.log("added = " + added + " | end = " + end);
        }
    }

    //draw the environnement
    this.draw = function() {
        for (let i in blocks) {
            blocks[i].draw(canvas);
        }
    }

    //check collisions
    this.checkCollisions = function(player) {
        var hitbox = player.hitbox;
        var hasGround = false;

        for (let i in blocks) {
            if (blocks[i].mayCollide(hitbox)) {
                //console.log("block may collide : " + blocks[i]);
                if (blocks[i].collide(player, hitbox)) {
                    //console.log("environnement.checkColisions: player is dead!");
                    return true;
                }
                if (!hasGround) {
                    hasGround = blocks[i] != undefined && blocks[i].isGround(hitbox);
                }
            }
        }
        //the player fall if he hasn't ground under his feet
        if (hasGround && player.falling) {
            //console.log("found ground");
            player.stopVerticalMove(0);
        } else if (!hasGround && !player.falling) {
            player.falling = true;
        }

        return false;
    }


    return {
        update: this.update,
        reset: this.reset,
        draw: this.draw,
        checkCollisions: this.checkCollisions
    };
})();


//======================================================= GLOBAL FUNCTIONS

var patternProvider;

// download global assets
function downloadAssets() {
    assetLoader.downloadAll();
    patternProvider = new PatternProvider(assetLoader.imgs);
}

//Variables
var canvas;
var started = false;
var player;

//Really start the game
function startGame() {
    //console.log("startGame()");
    if (started)
        return; //The game have already started
    started = true;

    // /!\ Only for offline test
    //downloadAssets();

    //init variables
    canvas = new MyCanvas();
    background.reset();
    player = new Player(canvas.blockSize);
    environement.reset();
    score = 0;

    canvas.canvas.ontouchstart = function() {
        player.jump();
    }

    //console.log("var inited, launch game");

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
 * Game over : called when the player dies
 */
function gameOver() {
    //console.log("Game over");
    //TODO :
    started = false; //stop the game loop
    saveScore(score);
    loser(); //show the 'game over' menu
}

/**
 * Game loop
 */
function animate() {
    if (started) {
        var drawHitboxes = false;
        //console.log("animate()");

        //1 update 
        if (!player.update()) {
            //the player fall down
            gameOver();
        }
        environement.update(0.7);

        //2 check collisins (TODO)
        if (environement.checkCollisions(player)) {
            gameOver();
        }

        //3 draw game 
        requestAnimFrame(animate);
        canvas.clear();

        background.draw(); //(update and draw)
        environement.draw();
        if (drawHitboxes) {
            canvas.drawRect(player.hitbox, "#b00000")
        }
        player.draw();
        canvas.drawScore(score);

        score++;

        // draw the score TODO
        //canvas.ctx.fillText('Score: ' + score, 20, 20);
    }
}