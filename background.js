// content.js

async function summarize(content) {
  try {
    const requestBody = {
      min_length: "62",
      text_to_summarize: content,
    };

    const response = await fetch("https://samurizer.adaptable.app/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error summarizing content:", error.message);
    throw error.message; // Rethrow the error for handling in the caller function
  }
}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Check if the message action is 'scrapedContent'
  if (message.action === "scrapedContent") {
    // Perform summarization logic
    const scrapedContent = message.content;

    // Example summarization logic (you can replace this with your own summarization algorithm)
    summarize(scrapedContent)
      .then((summarizedContent) => {
        console.log(summarizedContent);
        chrome.runtime.sendMessage({
          action: "transferData",
          data: summarizedContent.result,
        });
        sendResponse({
          action: "summarizedContent",
          content: summarizedContent.result,
        });
      })
      .catch((error) => {
        console.error("Error during summarization:", error);
        // Send an error response back to the content script
        sendResponse({ action: "summarizationError", error: error.message });
      });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});

let summaryData = "";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "transferData") {
    summaryData = message.data;
    chrome.storage.local.set({ summaryData: summaryData }, function () {
      console.log("Summary data saved:", summaryData);
    });
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "getSummaryData") {
    sendResponse({ action: "summaryData", data: summaryData });
  }
});
