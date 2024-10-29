document.addEventListener("DOMContentLoaded", () => {
    const friendCountElement = document.querySelector(".friend-count");
    const inviteButton = document.querySelector(".invite-button");
    const friendInfo = document.querySelector(".friend-info");
    const userNameElement = document.querySelector(".user-name");
    const lionsCountElement = document.querySelector(".lions-count");

    // Generate or retrieve a unique user ID
    let userId = localStorage.getItem('userId');
    if (!userId) {
        // If there's no userId in localStorage, generate a new unique ID
        userId = 'user_' + Math.random().toString(36).substr(2, 9); // Simple unique ID generator
        localStorage.setItem('userId', userId);
    }

    // Initialize friend data from localStorage
    let invitedFriends = JSON.parse(localStorage.getItem("invitedFriends")) || [];
    updateFriendInfo();

    // Set the current user's ID
    userNameElement.innerText = invitedFriends.length === 0 ? "No one invited" : invitedFriends[invitedFriends.length - 1];

    // Set up the invite button to share invite link via Telegram
    inviteButton.addEventListener("click", () => {
        // Replace "https://yourdomain.com" with your actual URL
        const inviteLink = `https://t.me/EcoCoinMaster_bot/friend.html?referrer=${userId}`;
        const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent("Join me on Lions Wallet and earn bonus Lions!")}`;

        // Open Telegram share URL
        window.open(telegramShareUrl, '_blank');
    });

    // Check if a friend joined via the invite link
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get("referrer");

    if (referrer && !invitedFriends.includes(referrer)) {
        invitedFriends.push(referrer); // Add the new friend ID
        localStorage.setItem("invitedFriends", JSON.stringify(invitedFriends)); // Save to localStorage

        // Update the balance (e.g., +359 Lions for each friend)
        let balance = parseInt(localStorage.getItem('balance')) || 100;
        balance += 359;
        localStorage.setItem('balance', balance);

        updateFriendInfo(); // Update UI to reflect new friend data
    }

    // Function to update friend info display
    function updateFriendInfo() {
        if (invitedFriends.length > 0) {
            friendCountElement.innerText = `${invitedFriends.length} friend(s)`;
            userNameElement.innerText = invitedFriends[invitedFriends.length - 1]; // Show the latest invited friend ID
            lionsCountElement.innerText = "+359 LIONS";
        } else {
            friendCountElement.innerText = ""; // Hide count when no friends are invited
            userNameElement.innerText = "No one invited"; // Initial text
            lionsCountElement.innerText = "+0 LIONS";
        }
    }
});
