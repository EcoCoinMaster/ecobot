// JavaScript to open the URL of each task box when clicked

document.addEventListener('DOMContentLoaded', () => {
    const taskBoxes = document.querySelectorAll('.task-box');

    taskBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const url = box.getAttribute('data-url');
            window.open(url, '_blank'); // Open URL in a new tab
        });
    });
});

// script.js
document.addEventListener("DOMContentLoaded", () => {
    // Get user data from localStorage
    const user = localStorage.getItem('user'); // Example to retrieve user information

    // Get balance element
    const balanceElement = document.querySelector(".balance p");
    
    // Initialize balance from localStorage or set to 100
    let balance = parseInt(localStorage.getItem('balance')) || 100;
    balanceElement.innerText = balance; // Set initial balance display

    // Select all follow buttons
    const followButtons = document.querySelectorAll(".follow-btn");

    followButtons.forEach((button, index) => {
        // Check follow status from localStorage
        const isFollowed = localStorage.getItem(`followedTask${index + 1}`) === 'true';
        
        if (isFollowed) {
            button.innerText = "Followed"; // Set button to followed
            button.classList.add("followed"); // Add class to change color
            button.style.backgroundColor = "#666"; // Change color
        }

        button.addEventListener("click", () => {
            if (button.innerText === "Follow") {
                button.innerText = "Followed"; // Change text
                button.classList.add("followed"); // Add class to change color
                button.style.backgroundColor = "#666"; // Change color on click
                
                // Store follow status in localStorage
                localStorage.setItem(`followedTask${index + 1}`, 'true');
                
                // Add 500 coins to the balance
                balance += 500;
                balanceElement.innerText = balance; // Update displayed balance
                
                // Store updated balance in localStorage
                localStorage.setItem('balance', balance);
            }
        });
    });
});
// Listen for balance updates from task.html
window.addEventListener("updateBalance", (event) => {
    const balanceElement = document.querySelector(".balance p");
    const newBalance = event.detail;
    balanceElement.innerText = newBalance; // Update displayed balance
});


