(function() {

  const DEFAULT_TIMER = "five";
  var sidebar = document.getElementById("sidebar");
  var timer = document.createElement("div");
  timer.classList.add("roundbox");
  timer.classList.add("sidebox");
  timer.id = "timer";

  function saveEndStateAndClearInterval(intervalId, location, display, message) {
    chrome.storage.local.set({ [location]: message }, function() {
      display.textContent = message;
      clearInterval(intervalId);
    });
  }

  function startTimer(duration, display) {
    var timer = duration,
      hours,
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
      hours = parseInt(timer / 3600, 10);
      minutes = parseInt((timer % 3600) / 60, 10);
      seconds = parseInt((timer % 3600) % 60, 10);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      if (!hours) {
        display.textContent = minutes + ":" + seconds;
      } else {
        display.textContent = hours + ":" + minutes + ":" + seconds;
      }

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
        if (timerId === "custom") {
          chrome.storage.local.get("custom", function(result) {
            var hours = result.custom.hours;
            var minutes = result.custom.minutes;
            var duration = 60 * 60 * hours + 60 * minutes;

            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;

            if (!hours) {
              timer.innerText = minutes + ":00";
            } else {
              timer.innerText = hours + ":" + minutes + ":00";
            }
            sidebar.prepend(timer);
            chrome.storage.local.set({ [location.href]: duration });
            chrome.runtime.sendMessage({ newTimer: true }, function() {
              startTimer(duration, timer);
            });
          });
        } else {
          var minutes = timerIdToTimer[timerId];
          var duration = 60 * minutes;
          minutes = minutes < 10 ? "0" + minutes : minutes;
          timer.innerText = minutes + ":00";
          sidebar.prepend(timer);
          chrome.storage.local.set({ [location.href]: duration });
          chrome.runtime.sendMessage({ newTimer: true }, function() {
            startTimer(duration, timer);
          });
        }
      });
    } else {
      var duration = obj[location.href];
      if (duration !== "Finished" && duration !== "Timed Out") {
        hours = parseInt(duration / 3600, 10);
        minutes = parseInt((duration % 3600) / 60, 10);
        seconds = parseInt((duration % 3600) % 60, 10);
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        if (!hours) {
          timer.innerText = minutes + ":" + seconds;
        } else {
          timer.innerText = hours + ":" + minutes + ":" + seconds;
        }
        sidebar.prepend(timer);
        startTimer(duration, timer);
      } else {
        timer.innerText = duration;
        sidebar.prepend(timer);
      }

      return;
    }
  });

})()
