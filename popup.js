const chatList = document.getElementById("chatList");
const searchInput = document.getElementById("search");

function renderChats(chats) {
  chatList.innerHTML = "";

  chats.forEach((chat) => {
    const div = document.createElement("div");
    div.className = "chat-item";
    div.innerHTML = `
      <strong>${chat.platform}</strong>
      <p>${chat.prompt.substring(0, 100)}...</p>
      <small>${new Date(chat.timestamp).toLocaleString()}</small>
      <button data-id="${chat.id}">Delete</button>
      <hr/>
    `;

    div.querySelector("button").addEventListener("click", () => {
      deleteChat(chat.id);
    });

    chatList.appendChild(div);
  });
}

function loadChats() {
  chrome.storage.local.get(["chats"], (result) => {
    const chats = result.chats || [];
    renderChats(chats);
  });
}

function deleteChat(id) {
  chrome.storage.local.get(["chats"], (result) => {
    let chats = result.chats || [];
    chats = chats.filter((c) => c.id !== id);
    chrome.storage.local.set({ chats }, loadChats);
  });
}

searchInput.addEventListener("input", (e) => {
  chrome.storage.local.get(["chats"], (result) => {
    const chats = result.chats || [];
    const filtered = chats.filter((c) =>
      c.prompt.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    renderChats(filtered);
  });
});

document.getElementById("exportBtn").addEventListener("click", () => {
  chrome.storage.local.get(["chats"], (result) => {
    const blob = new Blob([JSON.stringify(result.chats, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-history.json";
    a.click();
  });
});

loadChats();
