const DEFAULT_TIMER = "five";

function saveEndStateAndClearInterval(intervalId, location, display, message) {
  chrome.storage.local.set({ [location]: message }, function() {
    display.textContent = message;
    clearInterval(intervalId);
  });
}

function startTimer(duration, display) {
  var timer = duration,
    minutes,
    seconds;
  var intervalId = setInterval(function() {
    if (document.getElementsByClassName("verdict-accepted").length) {
      saveEndStateAndClearInterval(
        intervalId,
        location.href,
        display,
        "Finished"
      );
    }
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      saveEndStateAndClearInterval(
        intervalId,
        location.href,
        display,
        "Timed Out"
      );
    } else {
      chrome.storage.local.set({ [location.href]: timer });
    }
  }, 1000);
}

var sidebar = document.getElementById("sidebar");
var timer = document.createElement("div");
timer.classList.add("roundbox");
timer.classList.add("sidebox");
timer.id = "timer";

chrome.storage.local.get(location.href, function(obj) {
  if (!obj[location.href]) {
    const timerIdToTimer = {
      five: 05,
      ten: 10,
      fifteen: 15,
      twenty: 20,
      "twenty-five": 25,
      thirty: 30
    };

    chrome.storage.local.get("timer", function(obj) {
      var timerId = obj.timer || DEFAULT_TIMER;
      var duration = 60 * timerIdToTimer[timerId];
      timer.innerText = timerIdToTimer[timerId] + ":00";
      sidebar.prepend(timer);
      chrome.storage.local.set({ [location.href]: duration });
      chrome.runtime.sendMessage({ newTimer: true }, function() {
        startTimer(duration, timer);
      });
    });
  } else {
    var duration = obj[location.href];
    if (duration !== "Finished" && duration !== "Timed Out") {
      minutes = parseInt(duration / 60, 10);
      seconds = parseInt(duration % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      timer.innerText = minutes + ":" + seconds;
      sidebar.prepend(timer);
      startTimer(duration, timer);
    } else {
      timer.innerText = duration;
      sidebar.prepend(timer);
    }

    return;
  }
});
