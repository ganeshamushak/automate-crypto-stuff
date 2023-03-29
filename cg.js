// global variables
var domReadyAttempts = 1;

/**
 * Collect CoinGecko Candy
 */
const collectCGCandy = () => {
  if (location.origin.includes("coingecko")) {
    if ($("form.button_to").length == 0) {
      return;
    }
    var form = $("form.button_to")[0];
    var button = $(form).find("button")[0];
    $(button).trigger("click");
    chrome.runtime.sendMessage({ data: "CandyCollected" });
    initiateCloser();
  }
};

/**
 * Wait until the CoinGecko's page is ready
 */
const makeCoinGeckoDomReady = () => {
  setTimeout(function () {
    if (domReadyAttempts > 5) {
      close();
    }

    var length = $("form.button_to").length;
    var countdownTimer = $("#next-daily-reward-countdown-timer");

    if (countdownTimer.length == 0 && length == 0) {
      makeCoinGeckoDomReady();
      domReadyAttempts++;
    }

    if (length != 0) {
      collectCGCandy();
    } else {
      // countdownTimer == 1 => Meaning Candy has been collected.
      initiateCloser();
    }
  }, 1000);
};

const initiateCloser = () => {
  setCookie("alreadyOpened", "no");
  var timeRemaining = $('#next-daily-reward-countdown-timer').text();
  var splited = timeRemaining.split(':');
  var now = new Date();
  const future = new Date(now.getTime() + (parseInt(splited[0]) * 60 * 60 + parseInt(splited[1]) * 60 + parseInt(splited[2])) * 1000);
  setCookie('nextCollection', future.getTime());
  close();
};

/**
 * main function
 */
const init = () => {
  if (location.origin.includes("coingecko")) {
    makeCoinGeckoDomReady();
  } else {
    close();
  }
};

/**
 * Initiate the process
 */
init();
