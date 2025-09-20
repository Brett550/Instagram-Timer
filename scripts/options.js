document.getElementById("save").addEventListener("click", () => {
  const hours = parseInt(document.getElementById("hours").value) || 0;
  const minutes = parseInt(document.getElementById("minutes").value) || 0;
  const totalSeconds = (hours * 60 + minutes) * 60;

  chrome.storage.sync.set({ timeLimit: totalSeconds }, () => {
    document.getElementById("status").innerText = `Saved! Limit set to ${hours}h ${minutes}m`;
  });
});

// Restore saved value on load
chrome.storage.sync.get("timeLimit", (data) => {
  if (data.timeLimit) {
    const h = Math.floor(data.timeLimit / 3600);
    const m = Math.floor((data.timeLimit % 3600) / 60);
    document.getElementById("hours").value = h;
    document.getElementById("minutes").value = m;
  }
});
