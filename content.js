function extractTextFromElement(element) {
  if (!element) return ""; // Return empty string if element is null
  return element.innerText.trim();
}

// Function to scrape content from the webpage
async function scrapeContent() {
  let bodyText = extractTextFromElement(document.body);
  const data = await summarize(bodyText);
  console.log({ data: data.result });
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
  // Example: Display the summary in the console
  const result = document.getElementById("result");
  console.log({ summary });

  result.innerHTML = summary?.data;
  console.log("Summary:", summary);
}

// Execute the scraping logic when the page finishes loading
window.addEventListener("load", scrapeContent);

async function summarize(content) {
  const requestBody = {
    min_length: "62",
    text_to_summarize: content,
  };

  try {
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
