document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyzeButton');
    const sentimentDisplay = document.getElementById('sentimentDisplay');

    // Load API key from storage on popup open
    chrome.storage.sync.get('geminiApiKey', (data) => {
        if (data.geminiApiKey) {
            analyzeButton.disabled = false; // Enable Analyze button if API key is present
        } else {
            analyzeButton.disabled = true; // Disable Analyze button if API key is missing
        }
    });

    analyzeButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ message: "analyzeText" });
    });

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.message === "sentimentResult") {
            sentimentDisplay.textContent = "Sentiment: " + request.sentiment;
        } else if (request.message === "apiKeyStatus") {
            analyzeButton.disabled = !request.hasApiKey;
        }
    });
}); 