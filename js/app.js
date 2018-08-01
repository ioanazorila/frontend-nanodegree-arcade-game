/////////////////////////////////////// Enemies ///////////////////////////////////////

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/enemy-bug.png';
        // Random speed [100...400) for new enemy
        this.speed = 100 + Math.random() * 300;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        this.x += this.speed * dt;
        // Detect collisions between player and this enemy
        this.checkCollisions();
        // If enemy reaches right side of map, reset enemy
        if (this.x >= 505) {
            this.reset();
        }
    }

    // Reset enemy on left side of map, choosing a random Y position and random speed
    reset() {
        this.x = -100;
        this.y = enemyY[Math.floor(Math.random() * 3)];
        this.speed = 100 + Math.random() * 300;
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Detect collisions between player and the current enemy
    checkCollisions() {
        // x/y delta lower than width/height of player image
        // in order to avoid fake collisions with blank part of image, player's crown...
        if (Math.abs(player.x - this.x) < 70 && Math.abs(player.y - this.y) < 30) {
            player.updateLose();
        }
    }

}



/////////////////////////////////////// Player ///////////////////////////////////////

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-princess-girl.png';
        this.name = "The princess"
        this.gameStarted = false;
        this.lives = 3;
        this.score = 0;
    }

    // Draw player on screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Change character image and name
    selectPlayer(sprite) {
        this.sprite = sprite;
        switch (this.sprite) {
            case "images/char-princess-girl.png":
                this.name = "The princess";
                break;
            case "images/char-boy.png":
                this.name = "The boy";
                break;
            case "images/char-cat-girl.png":
                this.name = "Cat girl";
                break;
            case "images/char-horn-girl.png":
                this.name = "Horn girl";
                break;
            case "images/char-pink-girl.png":
                this.name = "Pink girl";
                break;
        }
        
    }

    // Start new game (allow player to move, update score)
    startGame() {
        this.gameStarted = true;
        this.lives = 3;
        this.score = 0;
        resetHearts();
    }

    // Move player according to user input
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

    // Update score on webpage
    update() {
        document.querySelector('.score').innerHTML = this.score;
    }
    
    // Update player life, score and position in case of collision with enemy
    updateLose() {
        this.reset();
        this.lives--;
        this.score--;
        if (this.lives > 0 ) {
            removeHeart();
        } else {
            this.gameStarted = false;
            gameOver();
        }
    }

    // Update player life, score and position if player reaches the water
    updateWin() {
        this.reset();
        this.score += 5;
    }

    // Reset initial position of player
    reset() {
        this.x = 202;
        this.y = 390;
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

// This listens for key presses and sends the keys to your Player.handleInput() method.
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


// Listen for click on "Select player" images
document.querySelector('.characters').addEventListener('click', function (e) {
    const selectedPlayer = e.target.classList.item(0);

    // Change character image according to selection
    player.selectPlayer('images/' + selectedPlayer + '.png');

    // Start game
    allEnemies = gameEnemies;
    player.startGame();

    // Hide "select player" menu, show score panel
    document.querySelector('.select-player').classList.add('hide');
    document.querySelector('.score-panel').classList.remove('hide');
});


// Listen for click on "Restart game" button
document.querySelector('.fa-sync-alt').addEventListener('click', function (e) {
    // Hide Win/Lose message, show "select player" menu
    document.querySelector('.win-lose-message').classList.add('hide');
    document.querySelector('.select-player').classList.remove('hide');

});



/////////////////////////////////// Other functions ///////////////////////////////////

function removeHeart() {
    document.querySelector('.fas.fa-heart').classList.add('far');
    document.querySelector('.fas.fa-heart').classList.remove('fas');
}


function resetHearts() {
    const hearts = document.querySelectorAll('.fa-heart');
    for (heart of hearts) {
        heart.classList.remove('far');
        heart.classList.add('fas');
    }
}


function gameOver() {
    // Update content of Win/Lose message
    if (player.score < 0) {
        document.querySelector('.win-header').innerHTML = player.name + " loses, with " + player.score + " points!";
    } else {
        document.querySelector('.win-header').innerHTML = player.name + " wins, with " + player.score + " points!";
    }
    
    // Hide score panel, show Win/Lose message
    document.querySelector('.score-panel').classList.add('hide');
    document.querySelector('.win-lose-message').classList.remove('hide');
}

