let currMoleTile;
let currPlantTiles = []; // Array to store tiles with plants
let score = 0;
let gameOver = false;
let moleInterval = 1000; // initial mole interval
let missPenalty = 5; // penalty for missing the mole
let timeLeft = 60; // 60-second game timer
let level = 1; // Start at level 1
let targetScore = 70; // Score needed to advance to the next level
let hammerDelay = 300; // How long the hammer stays visible after clicking

window.onload = function(){
    setGame();
}

function setGame(){
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setInterval(setMole, moleInterval);
    setInterval(setPlant, 1500);
    startTimer(); // start countdown timer
}

function getRandomTile(){
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole(){
    if(gameOver){
        return;
    }
    // Clear previous mole
    if (currMoleTile){
        currMoleTile.innerHTML = "";
    }
    let mole = document.createElement("img");
    mole.src = "./zombie1.png";
    
    let num = getRandomTile();
    let tile = document.getElementById(num);
    // Avoid placing the mole on a tile that currently has a plant
    if(currPlantTiles.includes(tile)){
        return;
    }
    currMoleTile = tile;
    currMoleTile.appendChild(mole);
}

function setPlant(){
    if(gameOver){
        return;
    }
    let plant = document.createElement("img");
    plant.src = "./police1.png";
    
    // Find a tile that doesn't already have a mole or another plant
    let attempts = 0;
    let tile;
    do {
        let num = getRandomTile();
        tile = document.getElementById(num);
        attempts++;
        // If after several attempts there's no free tile, exit
        if (attempts > 10) return;
    } while( (currMoleTile && tile.id === currMoleTile.id) || currPlantTiles.includes(tile) );

    tile.appendChild(plant);
    currPlantTiles.push(tile);

    // Remove the plant after 2 seconds if it hasn't been clicked
    setTimeout(() => {
        if(tile.contains(plant)){
            tile.removeChild(plant);
            let index = currPlantTiles.indexOf(tile);
            if(index > -1) {
                currPlantTiles.splice(index, 1);
            }
        }
    }, 2000);
}

function selectTile(){
    if(gameOver){
        return;
    }

    // Add hammer image when a tile is clicked
    let hammer = document.createElement("img");
    hammer.src = "./hammer.png";
    this.appendChild(hammer);

    // Remove the hammer image after a short delay
    setTimeout(() => {
        if (this.contains(hammer)) {
            this.removeChild(hammer);
        }
    }, hammerDelay);

    // If player clicks on the mole, update score and speed up mole appearance slightly
    if(this === currMoleTile){
        score += 10;
        moleInterval = Math.max(300, moleInterval - 50); // Prevent mole from getting too fast
        document.getElementById("score").innerText = score.toString();

        // Check if the player has reached the target score for the level
        if(score >= targetScore){
            goToNextLevel();
        }
    }
    // If player clicks on a tile that has a plant, game over immediately
    else if (currPlantTiles.includes(this)){
        document.getElementById("score").innerText = "GAME OVER: " + score.toString();
        gameOver = true;
    }
    // Otherwise, if the player clicks an empty tile, deduct points as a penalty
    else {
        score = Math.max(0, score - missPenalty); // Ensure score doesn't go negative
        document.getElementById("score").innerText = score.toString();
    }
}

function startTimer(){
    let timerInterval = setInterval(function(){
        if (timeLeft > 0 && !gameOver) {
            timeLeft--;
            document.getElementById("timer").innerText = "Time Left: " + timeLeft.toString() + "s";
        } else {
            clearInterval(timerInterval);
            gameOver = true;
            document.getElementById("score").innerText = "TIME UP! Final Score: " + score.toString();
        }
    }, 1000);
}

function goToNextLevel(){
    alert("Congratulations! You've reached Level " + (level + 1) + "!");

    // Increment level
    level++;

    // Increase difficulty by decreasing mole interval
    moleInterval += 200; // Speed up moles in the next level

    // Reset score to 0 for the next level
    score = 0;
    document.getElementById("score").innerText = score.toString();

    // Set new target score for the next level
    targetScore += 50;

    // Restart the mole and plant intervals with the new mole speed
    clearIntervals();
    setIntervals();
}

function clearIntervals(){
    let highestIntervalId = setInterval(() => {}, 1000); // Get highest interval ID
    for(let i = 0; i < highestIntervalId; i++){
        clearInterval(i); // Clear all intervals
    }
}

function setIntervals(){
    setInterval(setMole, moleInterval); // Set new mole interval
    setInterval(setPlant, 1500); // Plant interval remains the same
    startTimer(); // Restart the timer
}
