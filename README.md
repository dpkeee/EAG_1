# Sentiment Analyzer Chrome Extension

This Chrome extension analyzes the sentiment of selected text on a webpage using the Gemini 2.0 Flash API.

## Files

*   **`manifest.json`**: This file describes the extension to Chrome. It specifies the extension's name, version, permissions, background script, content scripts, and other metadata.

    *   `manifest_version`: Specifies the manifest file version (3 for modern extensions).
    *   `name`, `version`, `description`: Basic information about the extension.
    *   `permissions`: Declares the permissions the extension needs to function.
        *   `storage`: Allows the extension to store data (e.g., the API key).
        *   `scripting`: Allows the extension to inject scripts into web pages.
        *   `activeTab`: Allows the extension to access the currently active tab.
    *   `background`: Specifies the background script (service worker) that runs in the background.
        *   `service_worker`: The path to the background script (`background.js`).
    *   `content_scripts`: Specifies the content scripts to inject into web pages.
        *   `matches`: An array of URL patterns that the content script will be injected into (`<all_urls>` means all pages).
        *   `js`: An array of JavaScript files to inject (`content.js`).
    *   `options_page`: Specifies the HTML file for the extension's options page (`options.html`).
    *   `action`: Defines the popup UI.
        *   `default_popup`: The HTML file for the popup (`popup.html`).
        *   `default_icon`: Specifies the icons for the extension.
    *   `icons`: Specifies the icons for the extension in different sizes.

*   **`background.js`**: This is the background script (service worker) that runs in the background and handles the core logic of the extension.

    *   Listens for messages from the popup and content script.
    *   Retrieves the selected text from the `selectedTextForAnalysis` variable.
    *   Retrieves the Gemini API key from Chrome storage.
    *   Sends a request to the Gemini 2.0 Flash API to analyze the sentiment of the selected text.
    *   Sends the sentiment analysis result back to the popup.
    *   Listens for the `setSelectedText` message from the content script and stores the selected text in the `selectedTextForAnalysis` variable.
    *   Checks for the API key on startup and when storage changes.

*   **`popup.html`**: This is the HTML file for the extension's popup UI.

    *   Contains the UI elements for displaying the sentiment analysis result and the "Analyze" button.

*   **`popup.js`**: This JavaScript file controls the logic of the extension's popup UI.

    *   Sends the `analyzeText` message to the background script when the "Analyze" button is clicked.
    *   Displays the sentiment analysis result in the popup.
    *   Loads the API key from storage on popup open.

*   **`content.js`**: This is a content script that is injected into every webpage.

    *   Listens for the `mouseup` event (when the user releases the mouse button after selecting text).
    *   Gets the selected text using `window.getSelection().toString()`.
    *   Sends a `setSelectedText` message to the background script with the selected text.

*   **`options.html`**: This is the HTML file for the extension's options page.

    *   Contains the input field for the Gemini API key and a button to save it.

*   **`options.js`**: This JavaScript file controls the logic of the extension's options page.

    *   Saves the Gemini API key to Chrome storage.
    *   Loads the API key from storage on options page open.

*   **`icons/`**: This directory contains the icons for the extension in different sizes (16x16, 32x32, 192x192).

## Usage

1.  Load the extension in Chrome.
2.  Set your Gemini API key in the extension's options page.
3.  Select text on any webpage.
4.  Open the extension popup and click the "Analyze" button.
5.  The sentiment analysis result will be displayed in the popup.

## Permissions

The extension requires the following permissions:

*   `storage`: To store the Gemini API key.
*   `scripting`: To inject the content script into web pages.
*   `activeTab`: To access the currently active tab.

## API Key

The extension uses the Gemini 2.0 Flash API to analyze the sentiment of the selected text. You will need to obtain an API key from Google and enter it in the extension's options page.

## Notes

*   The extension uses the Gemini 2.0 Flash API, which may not be as accurate as dedicated sentiment analysis models.
*   The extension stores the API key in Chrome storage, which is a secure way to store sensitive data.