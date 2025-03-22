let selectedTextForAnalysis = "";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "analyzeText") {
        const textToAnalyze = selectedTextForAnalysis;
        chrome.storage.sync.get('geminiApiKey', (data) => {
            const apiKey = data.geminiApiKey;

            if (!apiKey) {
                chrome.runtime.sendMessage({ message: "sentimentResult", sentiment: 'API Key not found. Please enter it in the extension options.' });
                return;
            }

            analyzeSentiment(textToAnalyze, apiKey);
        });
    } else if (request.message === "setSelectedText") {
        selectedTextForAnalysis = request.text;
    }
});

function analyzeSentiment(selectedText, apiKey) {
  fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `In 1-2 sentences, what is the sentiment expressed in this text?: ${selectedText}` }]
      }]
    })
  })
  .then(response => response.json())
  .then(data => {
    // Handle the response from the Gemini API
    if (data.candidates && data.candidates.length > 0) {
      const sentiment = data.candidates[0].content.parts[0].text;
      // Send the sentiment to the popup
      chrome.runtime.sendMessage({ message: "sentimentResult", sentiment: sentiment });
    } else {
      chrome.runtime.sendMessage({ message: "sentimentResult", sentiment: 'Could not analyze sentiment.' });
    }
  })
  .catch(error => {
    console.error('Error:', error);
    chrome.runtime.sendMessage({ message: "sentimentResult", sentiment: 'Error analyzing sentiment.' });
  });
}

// Check for API key on startup and when storage changes
function checkApiKey() {
    chrome.storage.sync.get('geminiApiKey', (data) => {
        const hasApiKey = !!data.geminiApiKey;
        // Notify popup
        chrome.runtime.sendMessage({ message: "apiKeyStatus", hasApiKey: hasApiKey });
        // Notify content scripts (if needed) - omitted for brevity
    });
}

chrome.runtime.onStartup.addListener(() => {
    checkApiKey();
});

chrome.storage.onChanged.addListener(() => {
    checkApiKey();
});