// Default state
playerState = 'idle';

// Gets the dropdown element
const dropdown = document.getElementById('animations');

// Use event listener to detect change in the dropdown
dropdown.addEventListener('change', function(e){

    // When the event listener detects a change, playerState is set to that new value
    // target is referring to an element that was clicked
    playerState = e.target.value;

})

const canvas = document.getElementById('canvas1');

// You could also pass webgl to get access to a different set of methods
const ctx = canvas.getContext('2d');

console.log(ctx);

// Global size variables
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

// Bring image into the JS project (built in Image class constructor)
// This Image class will create an image element
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
// state - object in animation state being accessed
// index - stores num of each element as we cycle through the array
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
    // Takes in args to specify what area we want to clear, here we are clearing entire area
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Cycle through horizontal sprite sheets
    // Math.floor - get rid of decimal points, 6 - last number in idle animation frames currently being used
    // gameFrame is an ever increasing number, and staggerFrames is always 5
    let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length;

    // position will cycle between 0 and the number specified last (6)
    // X -> travels through sprite sheet horizontally
    let frameX = spriteWidth * position;

    // Y -> travels through sprite sheet vertically
    let frameY = spriteAnimations[playerState].loc[position].y;

    // For working with sprite animations - most interested in canvas drawImage() method
    // You can pass it 3, 5, or 9 args depending on how much control you want to have over the image 

    // If passing 5 args (Second - Fifth args are used to position and stretch entire image):
        // First arg - the image you want to draw
        // Second & Third args - x and y coordinates 
        // Fourth & Fifth args (if passing 5 args instead of 3) - width and height of the image
        // EXAMPLE: ctx.drawImage(playerImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // If passing 9 args:
        // First arg - the image you want to draw 
        // Second - Fifth args (src info/cropping) - determine rectangular area we want to cut out from the src image (x, y, width, height)
        // Sixth - Ninth args (canvas destination info) - where on canvas to draw that cropped part of the image (x, y, width, height)
        // ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

    // Multiplying spriteWidth and spriteHeight by a number allows you to use a different frame in that row or column
        // 0 * the width or height is the first sprite on the sheet
        // 1 * the width or height is the second sprite on the sheet, and so on
        // EXAMPLE: 0 * spriteWidth, 0 * spriteHeight is the sprite in first row and column (top left)
        // EXAMPLE: 0 * spriteWidth, 1 * spriteHeight is the sprite in second row and first column (left and first down)
        
        // We can remove * spriteWidth from frameX now because it is getting calculated previously
        ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 10, 30, spriteWidth, spriteHeight);

    gameFrame++;
    requestAnimationFrame(animate);
}

animate();


