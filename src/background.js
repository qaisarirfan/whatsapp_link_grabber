import Analytics from "../scripts/google-analytics";

chrome.runtime.addEventListener("unhandledrejection", async (event) => {
  Analytics.fireErrorEvent(event.reason);
});

chrome.runtime.onInstalled.addListener(() => {
  Analytics.fireEvent("install");
});

async function throwAnException() {
  throw new Error("👋 I'm an error");
}

// Throw an exception after a timeout to trigger an exception analytics event
setTimeout(throwAnException, 2000);
