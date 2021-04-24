(function() {
  const DEFAULT_TIMER = "five";
  
  function selectAndSendTimer(event) {
    var timer = event.target.id;
    var selectedTimer = document.getElementById(timer);
    if (timer === "custom") {
      var customTimerInputDiv = document.getElementById("custom-timer-input");
      customTimerInputDiv.style.display = "block";
    }
    chrome.storage.local.get("timer", function(obj) {
      var oldTimer = obj.timer;
      var oldSelectedTimer = document.getElementById(oldTimer);
      var defaultTimer = document.getElementById(DEFAULT_TIMER);
      defaultTimer.style.background = "white";
      if (oldSelectedTimer) {
        oldSelectedTimer.style.background = "white";
        if (oldTimer === "custom") {
          var customTimerInputDiv = document.getElementById("custom-timer-input");
          if (timer !== "custom") {
            customTimerInputDiv.style.display = "none";
          }
        }
      }

      chrome.storage.local.set({ timer: timer }, function() {
        selectedTimer.style.background = "#ffeeaaff";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.local.get("custom", function(result) {
      var oldCustomTimer = result.custom || { hours: 0, minutes: 0 };
      document.getElementById("hours").value = oldCustomTimer.hours;
      document.getElementById("minutes").value = oldCustomTimer.minutes;
    });
    chrome.storage.local.get("timer", function(obj) {
      var oldTimer = obj.timer || DEFAULT_TIMER;
      var oldSelectedTimer = document.getElementById(oldTimer);
      if (oldSelectedTimer) {
        oldSelectedTimer.style.background = "#ffeeaaff";
        if (oldTimer === "custom") {
          var customTimerInputDiv = document.getElementById("custom-timer-input");
          customTimerInputDiv.style.display = "block";
        }
      }
    });
    var timers = document.getElementsByClassName("timer-option");
    for (var i = 0; i < timers.length; i++) {
      timers[i].addEventListener("click", selectAndSendTimer);
    }

    var customTimerReset = document.getElementById("reset");
    customTimerReset.addEventListener("click", resetCustomTimer);

    var customTimerDone = document.getElementById("done");
    customTimerDone.addEventListener("click", doneCustomTimer);
  });

  function resetCustomTimer(event) {
    var hoursInput = document.getElementById("hours");
    var minutesInput = document.getElementById("minutes");

    hoursInput.value = "";
    minutesInput.value = "";
  }

  function doneCustomTimer(event) {
    var custom = { hours: 0, minutes: 0 };
    custom.hours = document.getElementById("hours").value;
    custom.minutes = document.getElementById("minutes").value;
    document.getElementById("custom-timer-input").style.display = "none";
    chrome.storage.local.set({ timer: "custom", custom: custom });
  }

})()
