//close tab after 20 mins
chrome.runtime.onMessage.addListener((message, sender) => {
    if(message.type == "close_tab")
    {
        if(sender.tab && sender.tab.id)
        {
            chrome.tabs.remove(sender.tab.id);
        } 
    }
        

});

// Helper to notify Instagram tab about focus state
function updateInstagramTabs(active) {
  chrome.tabs.query({ url: "*://www.instagram.com/*" }, (tabs) => {
    for (const tab of tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (isActive) => {
          window.postMessage({ type: "INSTAGRAM_TAB_ACTIVE", active: isActive }, "*");
        },
        args: [active]
      });
    }
  });
}

// Detect tab switch
chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].url?.includes("instagram.com")) {
      updateInstagramTabs(true);
    } else {
      updateInstagramTabs(false);
    }
  });
});

// Detect window focus/blur
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    updateInstagramTabs(false);
  } else {
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url?.includes("instagram.com")) {
        updateInstagramTabs(true);
      } else {
        updateInstagramTabs(false);
      }
    });
  }
});

//Detect instagram opening
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.includes("instagram.com")) {
    // If this new tab is the active one, mark as active
    chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
      if (activeTabs.length > 0 && activeTabs[0].id === tabId) {
        updateInstagramTabs(true);
      }
    });
  }
});
