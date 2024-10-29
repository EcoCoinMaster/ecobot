document.addEventListener("DOMContentLoaded", () => {
    const taskItems = document.querySelectorAll(".task-item");
    const userName = localStorage.getItem("username") || "Anonymous User";

    // Display initial tasks and hide claim buttons based on localStorage
    taskItems.forEach((taskItem) => {
        const claimButton = taskItem.querySelector(".claim-button");
        const taskId = taskItem.getAttribute("data-task-id");

        // Check if this task has already been claimed
        const isClaimed = localStorage.getItem(`claimed_${taskId}`) === "true";
        if (isClaimed) {
            // Hide the task if it has been claimed
            taskItem.style.display = "none";
            return; // Skip this task
        }

        // Hide the claim button initially
        claimButton.style.display = "none";

        // Click listener for task item to open URL and show claim button
        taskItem.addEventListener("click", () => {
            const url = taskItem.getAttribute("data-url");
            window.open(url, "_blank"); // Open the URL in a new tab
            claimButton.style.display = "block"; // Show the claim button
        });

        // Handle claim button click
        claimButton.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent triggering the task box click

            // Hide the current task item
            taskItem.style.display = "none";

            // Save claim status in localStorage
            localStorage.setItem(`claimed_${taskId}`, "true");

            // Add 500 points to balance in index.html
            addPointsToBalance(500);
        });
    });

    // Display a welcome message with the user's name
    const taskHeader = document.querySelector(".task-header h2");
    taskHeader.innerText = `Hello, ${userName}! See the tasks available`;

    // Function to add points to the balance and update localStorage
    function addPointsToBalance(points) {
        // Retrieve balance from localStorage or set to initial value
        let balance = parseInt(localStorage.getItem("balance")) || 100;
        balance += points;
        localStorage.setItem("balance", balance); // Update balance in localStorage

        // Update balance display on index.html
        const balanceElement = window.opener.document.querySelector(".balance p");
        if (balanceElement) balanceElement.innerText = balance;
    }
});
