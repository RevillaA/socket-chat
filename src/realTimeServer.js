module.exports = httpServer => {
    const { Server } = require("socket.io");
    const io = new Server(httpServer);  
    const connectedUsers = {};

    const getUser = socket => {
        const cookie = socket.request.headers.cookie || "";
        const usernameCookie = cookie.split(";").find(item => item.trim().startsWith("username="));
        return usernameCookie ? usernameCookie.split("=").pop() : "Usuario";
    };

    io.on("connection", socket => {
       connectedUsers[socket.id] = getUser(socket);
       io.emit("users", Object.values(connectedUsers));

       socket.on("message", message => {
            const user = getUser(socket);
            io.emit("message", {
                user : user,
                message : message, 
                timestamp : new Date().getTime(),
            });
       });

       socket.on("typing", () => {
            const user = getUser(socket);
            socket.broadcast.emit("typing", { user });
       });

       socket.on("stopTyping", () => {
            const user = getUser(socket);
            socket.broadcast.emit("stopTyping", { user });
       });

       socket.on("disconnect", () => {
            const user = getUser(socket);
            delete connectedUsers[socket.id];
            socket.broadcast.emit("stopTyping", { user });
            io.emit("users", Object.values(connectedUsers));
       });
    });
};
