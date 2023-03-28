const configurations = {
  collectCandyUrl: "https://www.coingecko.com/account/candy?locale=en",
};

/**
 * Listens tab change events
 */
chrome.runtime.onInstalled.addListener(function () {
  detectActivity();
});

/**
 * Listens on URL change events in current tab
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    detectActivity();
  }
});

/**
 * @returns If candy collection request is not initiated, it initates it.
 */
async function detectActivity() {
  try {
    const alreadyOpened = await getCookieValue("alreadyOpened", "https://www.coingecko.com");
    if (alreadyOpened == "yes") return;

    const nextCollection = await getCookieValue("nextCollection", "https://www.coingecko.com");

    if (nextCollection == undefined || new Date(parseInt(nextCollection)) < (new Date()).getTime()) {
      setCookie("alreadyOpened", "yes");
      chrome.tabs.create({ url: configurations.collectCandyUrl });
    }
  } catch (error) {
    console.error("Error reading cookie:", error);
  }
}

/**
 * Event listner after candy is collected
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.message == "CandyCollected") {

    setCookie("alreadyOpened", "no");
    const now = new Date();
    const future = new Date(now.getTime() + 22 * 60 * 60 * 1000); // setting next collection time after 22 hours
    setCookie("nextCollection", future.getTime());
  }
});

/**
 * Set a Cookie item
 * @param {*} key cookie key
 * @param {*} data cookie value
 */
const setCookie = (key, data) => {
  chrome.cookies.set({
    url: "https://www.coingecko.com",
    name: key,
    value: data,
  });
};

/**
 * Read cookie value  
 * @param {*} name Name of the key
 * @param {*} url URL for which cookie belongs
 * @returns Value for give key
 */
async function getCookieValue(name, url) {
  return new Promise((resolve, reject) => {
    chrome.cookies.get({name, url}, (cookie) => {
      if (cookie) {
        resolve(cookie.value);
      } else {
        resolve(undefined);
      }
    });
  });
}
