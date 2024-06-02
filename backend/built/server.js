"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var actions_1 = require("./actions");
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: ['http://localhost:4200']
}));
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST']
    }
});
var userSocketMap = {};
function getAllConnectedClients(roomId) {
    var clients = io.sockets.adapter.rooms.get(roomId);
    if (!clients) {
        return [];
    }
    return Array.from(clients).map(function (socketId) {
        return {
            socketId: socketId,
            username: userSocketMap[socketId]
        };
    });
}
io.on('connection', function (socket) {
    console.log('socket connected', socket.id);
    socket.on(actions_1.ACTIONS.JOIN, function (_a) {
        var roomId = _a.roomId, username = _a.username;
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        var clients = getAllConnectedClients(roomId);
        clients.forEach(function (_a) {
            var socketId = _a.socketId;
            io.to(socketId).emit(actions_1.ACTIONS.JOINED, {
                clients: clients,
                newClient: {
                    socketId: socket.id,
                    username: username
                }
            });
        });
    });
    socket.on(actions_1.ACTIONS.CODE_CHANGE, function (_a) {
        var roomId = _a.roomId, code = _a.code;
        socket.in(roomId).emit(actions_1.ACTIONS.CODE_CHANGE, { code: code });
    });
    socket.on(actions_1.ACTIONS.SYNC_CODE, function (_a) {
        var socketId = _a.socketId, code = _a.code;
        io.to(socketId).emit(actions_1.ACTIONS.CODE_CHANGE, { code: code });
    });
    socket.on(actions_1.ACTIONS.CURSOR_POSITION, function (_a) {
        var roomId = _a.roomId, cursor = _a.cursor;
        var username = userSocketMap[socket.id];
        socket.in(roomId).emit(actions_1.ACTIONS.CURSOR_POSITION, { cursor: cursor, socketId: socket.id, username: username });
    });
    socket.on('disconnecting', function () {
        var rooms = Array.from(socket.rooms);
        rooms.forEach(function (roomId) {
            socket.in(roomId).emit(actions_1.ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id]
            });
        });
        delete userSocketMap[socket.id];
    });
});
app.use(express_1.default.static(path_1.default.join(__dirname, 'public', 'browser')));
app.get('*', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, 'public', 'browser', 'index.html'));
});
var PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
