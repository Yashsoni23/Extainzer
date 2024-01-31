const result = document.getElementById("result");
// let data = "";
chrome.runtime.sendMessage({ action: "getSummaryData" }, function (response) {
  if (response && response.action === "summaryData") {
    console.log("Summary data");
    if (response.data) {
      result.innerHTML = response.data;
    }
  } else {
    result.innerHTML = "Loading...";
  }
});
