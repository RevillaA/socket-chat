const socket = io();
const send = document.querySelector('#send-message');
const allMessages = document.querySelector('#all-messages');

send.addEventListener('click', (event) => {
    const message = document.querySelector('#message');
    socket.emit("message", message.value);
    message.value = "";
});

document.querySelector('#message').addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        send.click();
    }
});

socket.on("message", ({ user, message}) => {
   const msg = document.createRange().createContextualFragment(`
    <div class="message">
        <div class="image-container">
            <img src="/img/avatar.jpg" alt="Foto de Antonio" height="50" width="50">
        </div>
        <div class="message-body">
            <div class="user-info">
                <span class="name">${user}</span>
                <span class="time">12:00 AM</span>
            </div>
            <p>${message}</p>
        </div>
    </div>
    `);
    allMessages.append(msg); 
});
