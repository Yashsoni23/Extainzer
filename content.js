function extractTextFromElement(element) {
  if (!element) return ""; // Return empty string if element is null
  return element.innerText.trim();
}

// Function to scrape content from the webpage
async function scrapeContent() {
  let bodyText = extractTextFromElement(document.body);
  chrome.runtime.sendMessage(
    { action: "scrapedContent", content: bodyText },
    async function (response) {
      // Handle the response from the background script
      if (response && response.action === "summarizedContent") {
        console.log("response:", response);
        displaySummary(response.content);
      }
    }
  );
}

// Function to display the summary
function displaySummary(summary) {
  console.log({ summary });
  chrome.runtime.sendMessage({ action: "transferData", data: summary });
}

// Execute the scraping logic when the page finishes loading
window.addEventListener("load", scrapeContent);
