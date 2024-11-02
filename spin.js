const spinButton = document.getElementById('spin-button');
const resultDisplay = document.querySelector('.result');
const messageDisplay = document.querySelector('.message');
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');

const baseOptions = [0, 2000, 500, 5000, 100, 'Another\nChance'];
let options = [];
const numSegments = baseOptions.length;
const segmentAngle = (2 * Math.PI) / numSegments;
let rotationAngle = 0;

// Function to shuffle the options array
function shuffleOptions() {
    options = [...baseOptions];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
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
    ctx.moveTo(195, 190);
    ctx.lineTo(225, 200);
    ctx.lineTo(195, 210);
    ctx.lineTo(195, 200);
    ctx.closePath();
    ctx.fillStyle = '#FF0000';
    ctx.fill();
}

// Function to update the time remaining message
function updateTimeRemaining() {
    const lastSpinTime = localStorage.getItem('lastSpinTime');
    const currentTime = Date.now();
    const sixHours = 6 * 60 * 60 * 1000;

    if (lastSpinTime) {
        const timeElapsed = currentTime - lastSpinTime;
        const timeRemaining = sixHours - timeElapsed;

        if (timeRemaining > 0) {
            const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
            messageDisplay.textContent = `Come back after ${hoursRemaining} hr${hoursRemaining > 1 ? 's' : ''}.`;
            spinButton.disabled = true;
        } else {
            messageDisplay.textContent = "You can spin now!";
            spinButton.disabled = false;
        }
    }
}

// Spin wheel animation
function spinWheel() {
    const lastSpinTime = localStorage.getItem('lastSpinTime');
    const currentTime = Date.now();
    const sixHours = 6 * 60 * 60 * 1000;

    if (lastSpinTime && currentTime - lastSpinTime < sixHours) {
        updateTimeRemaining();
        return;
    }

    shuffleOptions();
    localStorage.setItem('lastSpinTime', currentTime);
    messageDisplay.textContent = "Spinning...";
    spinButton.disabled = true;

    const spinDuration = 3000;
    let spinVelocity = Math.random() * 10 + 25;
    const decelerationFactor = 0.98;
    const minVelocity = 1;
    let startTime = null;

    function animateSpin(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        if (elapsed < spinDuration) {
            spinVelocity *= decelerationFactor;
            if (spinVelocity < minVelocity) spinVelocity = minVelocity;

            rotationAngle += spinVelocity / 100;
            rotationAngle %= 2 * Math.PI;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(200, 200);
            ctx.rotate(rotationAngle);
            ctx.translate(-200, -200);
            drawWheel();
            ctx.restore();
            drawPointer();

            requestAnimationFrame(animateSpin);
        } else {
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
        spinButton.disabled = false;
    } else {
        updateTimeRemaining();
    }

    if (typeof winningOption === 'number') {
        let currentBalance = parseInt(localStorage.getItem('balance')) || 0;
        currentBalance += winningOption;
        localStorage.setItem('balance', currentBalance);
    }
}

// Initial drawing
shuffleOptions();
drawWheel();
drawPointer();
updateTimeRemaining();

// Check time remaining every hour
setInterval(updateTimeRemaining, 60 * 60 * 1000);

// Spin button event listener
spinButton.addEventListener('click', spinWheel);
