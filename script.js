// Function to fetch user data from the backend
async function fetchUserData() {
    const telegramId = localStorage.getItem('telegramId'); // Retrieve saved ID

    if (!telegramId) return; // Return if no ID is saved

    try {
        const response = await fetch(`http://localhost:3000/api/user/${telegramId}`);
        if (response.ok) {
            const userData = await response.json();
            console.log("User Data:", userData);
        } else {
            console.error("User not found");
        }
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
}


// Initialize balance from localStorage or set to 100
let balance = parseInt(localStorage.getItem('balance')) || 100;

// Display balance
document.addEventListener("DOMContentLoaded", () => {
    const balanceElement = document.querySelector(".balance p");
    balanceElement.innerText = balance; // Initial display from localStorage

    // Fetch user data on page load
    fetchUserData();

    // Update balance from localStorage
    balance = parseInt(localStorage.getItem('balance')) || 100; // Get updated balance
    balanceElement.innerText = balance; // Update displayed balance

    // Select all follow buttons
    const followButtons = document.querySelectorAll(".follow-btn");

    followButtons.forEach((button, index) => {
        // Check follow status from localStorage
        const isFollowed = localStorage.getItem(`followedTask${index + 1}`) === 'true';
        
        if (isFollowed) {
            button.innerText = "Followed";
            button.classList.add("followed");
            button.style.backgroundColor = "#666";
        }

        button.addEventListener("click", () => {
            if (button.innerText === "Follow") {
                button.innerText = "Followed";
                button.classList.add("followed");
                button.style.backgroundColor = "#666";
                
                // Store follow status in localStorage
                localStorage.setItem(`followedTask${index + 1}`, 'true');
                
                // Add 500 coins to the balance
                balance += 500;
                balanceElement.innerText = balance;

                // Store updated balance in localStorage
                localStorage.setItem('balance', balance);
            }
        });
    });
});

