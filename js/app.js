/////////////////////////////////////// Enemies ///////////////////////////////////////

class Enemy {
    /**
     * Create an enemy
     * @param {number} x - the x coordinate
     * @param {number} y - the y coordinate
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/enemy-bug.png';

        // Random speed [50...250) for new enemy
        this.speed = 50 + Math.random() * 200;
    }

    /**
     * Draw the enemy on screen
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /**
     * Update the enemy's position
     * @param {number} dt - a time delta between ticks
     */
    update(dt) {
        this.x += this.speed * dt;

        // Check for collision between player and this enemy
        this.checkCollisions();

        //If enemy reaches right side of screen, level up player and reset enemy
        if (this.x >= 505) {
            player.levelUp();
            this.reset();
        }
    }

    /**
     * Detect collisions between player and current enemy
     */
    checkCollisions() {
        /* Detect if image of player and image of current enemy overlap.
         * x/y delta lower than width/height of player image,
         * in order to avoid fake collisions with transparent part of image, player's crown, etc.
         */
        if (Math.abs(player.x - this.x) < 70 && Math.abs(player.y - this.y) < 30) {
            player.updateLose();
        }
    }

    /**
     * Reset enemy on left side of screen, choosing a random Y position
     * Enemy speed increases with player level
     */
    reset() {
        this.x = -100;
        this.y = enemyY[Math.floor(Math.random() * 3)];
        this.speed = 50 * player.level + Math.random() * 200;
    }
}



/////////////////////////////////////// Player ///////////////////////////////////////

class Player {
    /**
     * Create a player
     * @param {number} x - the x coordinate
     * @param {number} y - the y coordinate
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-princess-girl.png';
        this.name = 'The princess';
        this.gameStarted = false;
        this.level = 1;
        this.lives = 3;
        this.score = 0;
        this.enemiesAvoided = 0;
    }

    /**
     * Draw player on screen
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /**
     * Change character image and name
     * @param {string} sprite - path to image selected by user
     */
    selectPlayer(sprite) {
        this.sprite = sprite;
        switch (this.sprite) {
            case 'images/char-princess-girl.png':
                this.name = 'The princess';
                break;
            case 'images/char-boy.png':
                this.name = 'The boy';
                break;
            case 'images/char-cat-girl.png':
                this.name = 'Cat girl';
                break;
            case 'images/char-horn-girl.png':
                this.name = 'Horn girl';
                break;
            case 'images/char-pink-girl.png':
                this.name = 'Pink girl';
                break;
        }
    }

    /**
     * Start new game
     */
    startGame() {
        // Reset level, lives and score and update hearts in score panel
        this.level = 1;
        this.lives = 3;
        this.score = 0;
        this.enemiesAvoided = 0;
        resetHearts();

        // Allow player to move
        this.gameStarted = true;
    }

    /**
     * Move player according to user input
     * @param {string} inputKey - arrow key pressed by the user
     */
    handleInput(inputKey) {
        switch (inputKey) {
            case 'left':
                this.x = Math.max(0, this.x - 101);
                break;
            case 'up':
                if (this.y <= 85) {
                    // Player reaches the water
                    this.updateWin();
                } else {
                    this.y -= 85;
                }
                break;
            case 'right':
                this.x = Math.min(404, this.x + 101);
                break;
            case 'down':
                this.y = Math.min(390, this.y + 85);
                break;
        }
    }

    /**
     * Update score and level on webpage
     */
    update() {
        document.querySelector('.score').innerHTML =`Score: ${this.score}`;
        document.querySelector('.level').innerHTML = `Level: ${this.level}`;
    }
    
    /**
     * Update player life, score and position in case of collition with enemy
     */
    updateLose() {
        this.reset();
        this.lives--;
        this.score -= 5;
        if (this.lives > 0 ) {
            removeHeart();
        } else {
            this.gameOver();
        }
    }

    /**
     * Update player life, score and position if player reaches the water
     */
    updateWin() {
        this.reset();
        this.score += 5 + this.level;
    }

    /** 
     * Increase number of enemies avoided, when an enemy reaches right side of map
     * Increase level every 5 avoided enemies
     */
    levelUp() {
        this.enemiesAvoided ++;
        this.level = 1 + Math.floor(this.enemiesAvoided/5);
    }

    /**
     * Reset player to his initial position
     */
    reset() {
        this.x = 202;
        this.y = 390;
    }

    /**
     * Stop the game, then update the Win/Lose message at the end of game
     */
    gameOver() {
        // Stop player and enemy movement
        this.gameStarted = false;

        // Update content of Win/Lose message
        if (this.score < 0) {
            document.querySelector('.win-header').innerHTML = `${this.name} loses, with ${this.score} points!`;
        } else {
            document.querySelector('.win-header').innerHTML = `${this.name} wins, with ${this.score} points!`;
        }
        
        // Hide score panel, show Win/Lose message
        document.querySelector('.score-panel').classList.add('hide');
        document.querySelector('.win-lose-message').classList.remove('hide');
    }

}



////////////////////// Global variables and instantiating objects /////////////////////

const player = new Player (202, 390);

// Y coordinates for each row of stone blocks
const enemyY = [60, 145, 230];

const enemy1 = new Enemy(-100, enemyY[0]);
const enemy2 = new Enemy(-100, enemyY[1]);
const enemy3 = new Enemy(-100, enemyY[2]);
const gameEnemies = [enemy1, enemy2, enemy3];

// allEnemies will be set after character selection
let allEnemies = [];


/////////////////////////////////// Event listeners ///////////////////////////////////

/**
 * Listen for key presses and send the keys to the Player.handleInput() method
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (player.gameStarted) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});


/**
 * Listen for click on "Select player" images
 */
document.querySelector('.characters').addEventListener('click', function (e) {
    const selectedPlayer = e.target.classList.item(0);

    // Change character image according to selection
    player.selectPlayer(`images/${selectedPlayer}.png`);

    // Start the game
    allEnemies = gameEnemies;
    player.startGame();

    // Hide "Select player" menu, show score panel
    document.querySelector('.select-player').classList.add('hide');
    document.querySelector('.score-panel').classList.remove('hide');
});


/**
 * Listen for click on "Restart game" button
 */
document.querySelector('.fa-sync-alt').addEventListener('click', function (e) {
    // Hide "Win/Lose message", show "Select player" menu
    document.querySelector('.win-lose-message').classList.add('hide');
    document.querySelector('.select-player').classList.remove('hide');
});


/////////////////////////////////// Other functions ///////////////////////////////////

/**
 * Remove a heart from score panel when player loses a life
 */
function removeHeart() {
    document.querySelector('.fas.fa-heart').classList.add('far');
    document.querySelector('.fas.fa-heart').classList.remove('fas');
}

/**
 * Reset score panel to display 3 full lives when user restarts the game
 */
function resetHearts() {
    const hearts = document.querySelectorAll('.fa-heart');
    for (heart of hearts) {
        heart.classList.remove('far');
        heart.classList.add('fas');
    }
}