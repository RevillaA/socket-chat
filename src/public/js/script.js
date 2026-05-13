const socket = io();
const send = document.querySelector('#send-message');
const allMessages = document.querySelector('#all-messages');
const message = document.querySelector('#message');
const typingStatus = document.querySelector('#typing-status');

const cookies = document.cookie.split(";");
const usernameCookie = cookies.find(cookie => cookie.trim().startsWith("username="));
const currentUser = usernameCookie ? usernameCookie.trim().replace("username=", "") : "";
let typingTimer;
let isTyping = false;

const stopTyping = () => {
    clearTimeout(typingTimer);

    if (isTyping) {
        socket.emit("stopTyping");
        isTyping = false;
    }
};

send.addEventListener('click', (event) => {
    if (message.value.trim() === "") {
        stopTyping();
        return;
    }

    socket.emit("message", message.value);
    message.value = "";
    stopTyping();
});

message.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        send.click();
    }
});

message.addEventListener('input', () => {
    if (message.value.trim() === "") {
        stopTyping();
        return;
    }

    if (!isTyping) {
        socket.emit("typing");
        isTyping = true;
    }

    clearTimeout(typingTimer);
    typingTimer = setTimeout(stopTyping, 1200);
});

socket.on("message", ({ user, message, timestamp}) => {
   const messageClass = user === currentUser ? "own-message" : "other-message";
   const time = new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
   });

   const msg = document.createRange().createContextualFragment(`
    <div class="message ${messageClass}">
        <div class="image-container">
            <img src="/img/avatar.jpg" alt="Foto de Antonio" height="50" width="50">
        </div>
        <div class="message-body">
            <div class="user-info">
                <span class="name">${user}</span>
                <span class="time">${time}</span>
            </div>
            <p>${message}</p>
        </div>
    </div>
    `);
    allMessages.append(msg); 
});

socket.on("typing", ({ user }) => {
    typingStatus.dataset.user = user;
    typingStatus.textContent = `${user} esta escribiendo...`;
});

socket.on("stopTyping", ({ user }) => {
    if (typingStatus.dataset.user === user) {
        typingStatus.textContent = "";
        delete typingStatus.dataset.user;
    }
});
