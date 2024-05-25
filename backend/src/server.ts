import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { ACTIONS } from './actions';

const app = express();

const server = http.createServer(app);

const io = new Server(server);

interface UserSocketMap {
    [key: string]: string;
}

const userSocketMap: UserSocketMap = {};

function getAllConnectedClients(roomId: string) {
    const clients = io.sockets.adapter.rooms.get(roomId);
    if (!clients) {
        return [];
    }
    return Array.from(clients).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId]
        }
    })
}

io.on('connection', (socket) => {
    
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                newClient: {
                    socketId: socket.id,
                    username
                }
            })
        })
    })

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    })

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    })

    socket.on('disconnecting', () => {
        const rooms = Array.from(socket.rooms);
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id] 
            })
            socket.leave(roomId);
        })

        delete userSocketMap[socket.id];
    })
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});