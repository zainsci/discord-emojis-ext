import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

function getEmojiId(url) {
  const match = url.match(/\/emojis\/(\d+)\.webp/);
  return match ? match[1] : null;
}

// Function to handle the click event
function handleElementClick(element) {
  // Get the URL from the element (adjust the attribute based on where your URL is stored)
  const url =
    element.getAttribute('src') ||
    element.getAttribute('href') ||
    element.dataset.url;

  if (url) {
    // Copy to clipboard
    const emojiID = getEmojiId(url);
    navigator.clipboard
      .writeText(emojiID)
      .then(() => {
        console.log('Emoji ID Copied:', emojiID);
        // Optional: Add some visual feedback
        element.style.outline = '2px solid red';
        setTimeout(() => {
          element.style.outline = '';
        }, 500);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  }
}

// Function to set up event delegation
function setupClickListener(selector) {
  document.addEventListener('click', (event) => {
    // Check if the clicked element or any of its parents match the selector
    const targetElement = event.target.closest(selector);

    if (targetElement) {
      handleElementClick(targetElement);
    }
  });
}

// Set up mutation observer to watch for new content
function watchForNewContent(containerSelector) {
  const observer = new MutationObserver((mutations) => {
    // We don't need to do anything here because event delegation handles new elements
    console.log('Content changed');
  });

  // Get the container element to observe
  const container = document.querySelector(containerSelector);

  if (container) {
    // Configure the observer to watch for changes in the DOM
    observer.observe(container, {
      childList: true, // Watch for changes in direct children
      subtree: true, // Watch for changes in all descendants
      attributes: false, // Don't watch for attribute changes
    });
  }
}

// Usage example:
// Replace '.message-element' with your specific selector
// Replace '.messages-container' with your container selector
function initialize() {
  setupClickListener('img.emoji');
  watchForNewContent('ol[data-list-id="chat-messages"]');
}

// Initialize when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
