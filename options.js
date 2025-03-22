document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyButton = document.getElementById('saveApiKey');

    // Load API key from storage on options page open
    chrome.storage.sync.get('geminiApiKey', (data) => {
        if (data.geminiApiKey) {
            apiKeyInput.value = data.geminiApiKey;
        }
    });

    saveApiKeyButton.addEventListener('click', () => {
        const apiKey = apiKeyInput.value;
        chrome.storage.sync.set({ 'geminiApiKey': apiKey }, () => {
            alert('API Key saved!');
        });
    });
}); 