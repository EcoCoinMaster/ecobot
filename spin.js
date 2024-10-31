const spinButton = document.getElementById('spin-button');
const resultDisplay = document.querySelector('.result');
const messageDisplay = document.querySelector('.message');
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');

const baseOptions = [0, 2000, 500, 5000, 100, 'Another\nChance']; // Base options for the wheel
let options = []; // This will hold the current shuffled options
const numSegments = baseOptions.length;
const segmentAngle = (2 * Math.PI) / numSegments;
let rotationAngle = 0;  // Current rotation angle

// Function to shuffle the options array
function shuffleOptions() {
    options = [...baseOptions]; // Copy base options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]]; // Swap elements
    }
}

// Function to draw the wheel
function drawWheel() {
    for (let i = 0; i < numSegments; i++) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, i % 2 === 0 ? '#f8f9fa' : '#2c2c2c');
        gradient.addColorStop(1, i % 2 === 0 ? '#b0b3b8' : '#1a1a1a');

        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 180, segmentAngle * i, segmentAngle * (i + 1));
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(segmentAngle * (i + 0.5));
        ctx.fillStyle = i % 2 === 0 ? '#000000' : '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';

        const text = options[i].toString().split('\n');
        text.forEach((line, j) => {
            ctx.fillText(line, 130, j * 18 - 10);
        });

        ctx.restore();
    }
}

// Draw pointer at the center pointing to the left with margin
function drawPointer() {
    ctx.beginPath();
    ctx.moveTo(195, 190); // Adjusted base slightly to center
    ctx.lineTo(225, 200); // Right point of the pointer (flipped horizontally)
    ctx.lineTo(195, 210); // Bottom point of the pointer
    ctx.lineTo(195, 200); // Back to the base
    ctx.closePath();
    ctx.fillStyle = '#FF0000'; // Pointer color
    ctx.fill();
}

// Spin wheel animation
function spinWheel() {
    const lastSpinTime = localStorage.getItem('lastSpinTime');
    const currentTime = Date.now();
    const sixHours = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

    // Check if the user can spin again
    if (lastSpinTime && currentTime - lastSpinTime < sixHours) {
        messageDisplay.textContent = "Come back after 6 hours.";
        spinButton.disabled = true;
        return;
    }

    // Shuffle the options before spinning
    shuffleOptions();

    // Store the current time as the last spin time
    localStorage.setItem('lastSpinTime', currentTime);
    messageDisplay.textContent = "Spinning...";

    const spinDuration = 3000; // Total spin duration in milliseconds
    let spinVelocity = Math.random() * 10 + 25; // Initial speed for fast spin
    const decelerationFactor = 0.98; // Factor to slow down the spin
    const minVelocity = 1; // Minimum velocity to stop spinning

    let startTime = null;

    function animateSpin(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        // Calculate the current spin velocity
        if (elapsed < spinDuration) {
            // Gradually reduce the speed
            spinVelocity *= decelerationFactor;
            if (spinVelocity < minVelocity) spinVelocity = minVelocity; // Ensure it doesn't go below the minimum

            // Update rotation angle based on current velocity
            rotationAngle += spinVelocity / 100; // Adjust the divisor to control spin speed
            rotationAngle %= 2 * Math.PI; // Keep angle within 0 to 2π

            // Clear and redraw the canvas for each frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(200, 200);
            ctx.rotate(rotationAngle);
            ctx.translate(-200, -200);
            drawWheel();
            ctx.restore();
            drawPointer();

            // Continue the animation
            requestAnimationFrame(animateSpin);
        } else {
            // Final spin
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(200, 200);
            ctx.rotate(rotationAngle);
            ctx.translate(-200, -200);
            drawWheel();
            ctx.restore();
            drawPointer();
            determineWinningSegment(rotationAngle);
        }
    }

    // Start the animation
    requestAnimationFrame(animateSpin);
}

// Determine winning segment based on rotation angle
function determineWinningSegment(angle) {
    const normalizedAngle = (2 * Math.PI - (angle % (2 * Math.PI))) % (2 * Math.PI);
    let segmentIndex = Math.floor(normalizedAngle / segmentAngle);
    
    const winningOption = options[segmentIndex];
    resultDisplay.textContent = `You won: ${winningOption}`;
    
    if (winningOption === 'Another\nChance') {
        messageDisplay.textContent = "Spin again!";
        spinButton.disabled = false; // Allow spinning again
    } else {
        messageDisplay.textContent = "Come back after 6 hours.";
        spinButton.disabled = true; // Disable spin button until 6 hours are up
    }

    // Store the winning amount in local storage
    if (typeof winningOption === 'number') { // Ensure it's a numeric win
        let currentBalance = parseInt(localStorage.getItem('balance')) || 0;
        currentBalance += winningOption; // Add the winning amount
        localStorage.setItem('balance', currentBalance); // Update local storage
    }
}

// Initial drawing
shuffleOptions(); // Shuffle options at the start
drawWheel();
drawPointer();

// Spin button event listener
spinButton.addEventListener('click', spinWheel);
