const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");
const saveButton = document.getElementById("save-button");
const darkModeToggle = document.getElementById("dark-mode-toggle");

const serverURL = `https://it3049c-chat.fly.dev/messages`;

if (!localStorage.getItem("username")) {
  myMessage.disabled = true;
}

nameInput.value = localStorage.getItem("username");
if (nameInput.value) {
  myMessage.disabled = false;
}

function fetchMessages() {
  return fetch(serverURL).then((response) => response.json());
}

function formatMessage(message, myNameInput) {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

  if (myNameInput === message.sender) {
    return `
      <div class="mine messages">
          <div class="message">
              ${message.text}
          </div>
          <div class="sender-info">
              ${formattedTime}
          </div>
      </div>
    `;
  } else {
    return `
      <div class="yours messages">
          <div class="message">
              ${message.text}
          </div>
          <div class="sender-info">
              ${message.sender} ${formattedTime}
          </div>
      </div>
    `;
  }
}

async function updateMessages() {
  const messages = await fetchMessages();
  let formattedMessages = "";
  messages.forEach((message) => {
    formattedMessages += formatMessage(message, nameInput.value);
  });
  chatBox.innerHTML = formattedMessages;
}

sendButton.addEventListener("click", function (sendButtonClickEvent) {
  sendButtonClickEvent.preventDefault();
  const sender = nameInput.value;
  const message = myMessage.value;

  sendMessages(sender, message);
  myMessage.value = "";
});

function sendMessages(username, text) {
  const newMessage = {
    sender: username,
    text: text,
    timestamp: new Date(),
  };

  fetch(serverURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMessage),
  });
}

saveButton.addEventListener("click", function (saveButtonClickEvent) {
  saveButtonClickEvent.preventDefault();
  const username = nameInput.value;
  localStorage.setItem("username", username);
  myMessage.disabled = false;
});

nameInput.addEventListener("input", function (inputEvent) {
  const username = inputEvent.target.value;
  localStorage.setItem("username", username);
});

darkModeToggle.addEventListener("click", function () {
  document.documentElement.classList.toggle("dark-mode");
});

updateMessages();

const MILLISECONDS_IN_TEN_SECONDS = 10000;
setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);
