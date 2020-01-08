function saveEndStateAndClearInterval(intervalId, location, message) {
  chrome.storage.local.set({ [location]: message }, function() {
    clearInterval(intervalId);
  });
}

function startTimer(duration, location) {
  var timer = duration,
    minutes,
    seconds;
  var intervalId = setInterval(function() {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    if (--timer < 0) {
      saveEndStateAndClearInterval(intervalId, location, "Timed Out");
    } else {
      chrome.storage.local.set({ [location]: timer });
    }
  }, 1000);
}

chrome.runtime.onMessage.addListener(function(request) {
  if (request.newTimer) {
    chrome.storage.local.get(null, function(items) {
      Object.entries(items).forEach(function([key, value]) {
        if (key !== "timer" && value !== "Finished" && value !== "Timed Out") {
          startTimer(value, key);
        }
      });
    });
  }
});
