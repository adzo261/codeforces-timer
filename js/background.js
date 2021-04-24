(function() {

  function saveEndStateAndClearInterval(intervalId, location, message) {
    chrome.storage.local.set({ [location]: message }, function() {
      clearInterval(intervalId);
    });
  }

  function startTimer(duration, location) {
    var timer = duration;
    var intervalId = setInterval(function() {
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
          if (
            key !== "timer" &&
            key !== "custom" &&
            value !== "Finished" &&
            value !== "Timed Out"
          ) {
            startTimer(value, key);
          }
        });
      });
    }
  });

})()