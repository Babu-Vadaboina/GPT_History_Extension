function extractChat() {
  const messages = document.querySelectorAll("article");

  if (messages.length < 2) return;

  const lastUser = messages[messages.length - 2];
  const lastAI = messages[messages.length - 1];

  const userText = lastUser.innerText;
  const aiText = lastAI.innerText;

  if (!userText || !aiText) return;

  chrome.runtime.sendMessage({
    type: "SAVE_CHAT",
    payload: {
      prompt: userText,
      response: aiText,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      platform: location.hostname.includes("gemini") ? "Gemini" : "ChatGPT",
    },
  });
}

const observer = new MutationObserver(() => {
  extractChat();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
