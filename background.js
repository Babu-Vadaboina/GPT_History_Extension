chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_CHAT") {
    chrome.storage.local.get(["chats"], (result) => {
      const chats = result.chats || [];

      chats.unshift({
        id: Date.now(),
        ...message.payload,
      });

      chrome.storage.local.set({ chats });
    });
  }
});
