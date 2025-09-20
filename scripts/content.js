// Create timer display
const timerDiv = document.createElement("div");
timerDiv.id = "insta-timer";
timerDiv.innerText = "0:00";
document.body.appendChild(timerDiv);

let seconds = 0;
let interval = null;
let timeLimit = 1200;


// Load user’s saved time limit
chrome.storage.sync.get("timeLimit", (data) => {
  if (data.timeLimit) {
    timeLimit = data.timeLimit;
  }
});

function startTimer() 
{
  if (!interval) 
    {
        interval = setInterval(() => 
        {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerDiv.innerText = `${minutes}:${secs.toString().padStart(2, "0")}`;

            if (seconds >= timeLimit) 
            { //change to 1200 for 20 min
                clearInterval(interval);
                interval = null;
                chrome.runtime.sendMessage({ type: "close_tab" });
            }
        }, 1000);
    }
}

function stopTimer() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

// Listen for focus/blur updates from background
window.addEventListener("message", (event) => {
  if (event.data?.type === "INSTAGRAM_TAB_ACTIVE") {
    if (event.data.active) {
      startTimer();
    } else {
      stopTimer();
    }
  }
});
