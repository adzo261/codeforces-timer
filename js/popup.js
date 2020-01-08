const DEFAULT_TIMER = "five";
function selectAndSendTimer(event) {
  var timer = event.target.id;
  var selectedTimer = document.getElementById(timer);

  chrome.storage.local.get("timer", function(obj) {
    var oldTimer = obj.timer;
    var oldSelectedTimer = document.getElementById(oldTimer);
    if (oldSelectedTimer) {
      oldSelectedTimer.style.background = "white";
    }

    chrome.storage.local.set({ timer: timer }, function() {
      selectedTimer.style.background = "#ffeeaaff";
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.local.get("timer", function(obj) {
    var oldTimer = obj.timer || DEFAULT_TIMER;
    var oldSelectedTimer = document.getElementById(oldTimer);
    if (oldSelectedTimer) {
      oldSelectedTimer.style.background = "#ffeeaaff";
    }
  });
  var timers = document.getElementsByClassName("timer-option");
  for (var i = 0; i < timers.length; i++) {
    timers[i].addEventListener("click", selectAndSendTimer);
  }
});
