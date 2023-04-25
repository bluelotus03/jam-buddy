let cookies = document.cookie;
const canvas = document.getElementById('canvas1');
const meta_wrapper = document.querySelector('.meta_wrapper')
var dialog = document.querySelector('dialog');

show_app_info = function() {
    canvas.style.display = 'block';
    canvas.style.visibility = 'visible';
    meta_wrapper.style.display = 'flex';
    meta_wrapper.style.visibility = 'visible';
}

/* --------------  INFO PAGE LOGIC --------------- */

// If user has already clicked "ok" for the info box previously, go straight to the jam page
if (cookies.split(';').some((item) => item.trim().startsWith('accepted='))) {
    dialog.close();
    show_app_info();

// If it's the user's first visit to the info page, wait for clicking "ok" to close the info box and go to the jam page
} else {
    dialog.show();
    document.querySelector('#close').onclick = function() {
        dialog.close();
        show_app_info();
        document.cookie = 'accepted=true';
    };
}

/* -------------  COUNTDOWN LOGIC ---------- */
let timeInterval = 'default';
let countTime = 0;

const timeDropdown = document.getElementById('time');

// Use event listener to detect change in the dropdown
timeDropdown.addEventListener('change', function(e){

    // When the event listener detects a change, timeInterval is set to that new value
    timeInterval = e.target.value;

    switch(timeInterval) {
        case '10sec':
            countTime = 10000;
            break;
        case '1min':
            countTime = 60000;
            break;
        case '5min':
            countTime = 300000;
            break;
        case '10min':
            countTime = 600000;
            break;
    }

    const timerButton = document.getElementById('startTime');
    timerButton.style.visibility = 'visible';
    timerButton.style.display = 'block';

});

const startTimeButton = document.getElementById('startTimer');

function startTime() {
    setTimeout(goToEndPage, countTime);
}

function goToEndPage() {
    // nav to end page
    window.location = '/';
}







/* -------------  SONG STATES LOGIC ---------- */
// TODO


/* -------------  ANIMATION STATES LOGIC ---------- */

// Default state
let playerState = 'idle';

// Gets the dropdown element
const dropdown = document.getElementById('animations');

// Use event listener to detect change in the dropdown
dropdown.addEventListener('change', function(e){

    // When the event listener detects a change, playerState is set to that new value
    playerState = e.target.value;

});

// You could also pass webgl to get access to a different set of methods
const ctx = canvas.getContext('2d');

console.log(ctx);

// Global size variables
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

// Bring image into the JS project (built in Image class constructor)
const playerImage = new Image();

playerImage.src = 'po-animations.png';

// If take entire file and divide width by the number of columns --> get width of 1 frame
// This sprite sheet is 6876px wide and has 12 columns --> 573px (going to use 575px for now - last frame is a bit smaller and margin isn't perfect)
const spriteWidth = 575;

// Divide height of sprite sheet (5230px) by number of rows (10) to get height of 1 frame --> 523px 
const spriteHeight = 523;

// Used to count frame rate and work with staggerFrames in the animate() function
gameFrame = 0;

// Will slow down animation by that amount -- higher the number, the slower the animation will be 
const staggerFrames = 10;

// Stores all the positions of sprites for a given animation (row) as calculated in forEach() below
const spriteAnimations = [];

// Used to create a simple map that will match sprite sheet
const animationStates = [
    {
        name: 'idle',
        numOfFrames: 12,
    },
    {
        name: 'sad',
        numOfFrames: 12,
    }, 
    {
        name: 'happy',
        numOfFrames: 10,
    },
    {
        name: 'rage',
        numOfFrames: 12,
    },
];

// This callback function will run for each element in the animationStates array
animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }

    for (let j = 0; j < state.numOfFrames; j++){

        // positionX will continue to increase for each frame in the current animation state (moving right in the row of sprites)
        let positionX = j * spriteWidth;

        // positionY will be same for all sprites a row - like "idle" animation
        // then once a row is done, the outer loop will increase the index and move down a row to the next animation
        let positionY = index * spriteHeight;

        // Push these values to the loc array above
        frames.loc.push({
            x: positionX,
            y: positionY
        });
    }

    // Save each animation state with its frame locations info that has been stored in the frames array
    spriteAnimations[state.name] = frames;
});

// See the animation objects with all of their frame locations (x and y coordinates)
console.log(spriteAnimations);

function animate() { 

    // Clear previous drawing for each animation frame
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Cycle through the sprite sheet
    let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length;

    // X -> travels through sprite sheet horizontally
    let frameX = spriteWidth * position;

    // Y -> travels through sprite sheet vertically
    let frameY = spriteAnimations[playerState].loc[position].y;

        // For working with sprite animations
        ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 10, 30, spriteWidth, spriteHeight);

    gameFrame++;
    requestAnimationFrame(animate);
}

animate();
