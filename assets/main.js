const endpoint = "https://websocket-nest-production.up.railway.app";

const socket = io(endpoint);

const nameStorage = localStorage.getItem("nameChatRealTime");

if (nameStorage) {
  document.getElementById("userName").value = nameStorage;
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

window.onload = async () => {
  try {
    const response = await fetch(`${endpoint}/chat`);
    const messages = await response.json();

    messages.forEach((message) => {
      const li = document.createElement("li");

      const senderSpan = document.createElement("span");
      senderSpan.textContent = `${message.sender}`;
      senderSpan.style.color = getRandomColor();
      senderSpan.style.fontWeight = "bold";

      li.appendChild(senderSpan);
      li.appendChild(document.createTextNode(` : ${message.message}`));

      document.getElementById("messages").appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

socket.on("msgToClient", (message) => {
  const li = document.createElement("li");

  const senderSpan = document.createElement("span");
  senderSpan.textContent = `${message.sender}`;
  senderSpan.style.color = getRandomColor();
  senderSpan.style.fontWeight = "bold";

  li.appendChild(senderSpan);
  li.appendChild(document.createTextNode(` : ${message.message}`));

  const messagesList = document.getElementById("messages");
  messagesList.insertBefore(li, messagesList.firstChild);
});

function sendMessage() {
  const name = document.getElementById("userName").value;
  const message = document.getElementById("message").value;

  if (!name || !message) {
    alert("Please enter both your name and message.");
    return;
  }

  socket.emit("msgToServer", { sender: name, message: message });
  document.getElementById("message").value = "";

  localStorage.setItem("nameChatRealTime", name);
}
