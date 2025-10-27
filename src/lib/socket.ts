import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocketIO = (res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('Inicializando Socket.IO...');
    
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Cliente conectado:', socket.id);

      socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
      });
    });

    res.socket.server.io = io;
  }
  
  return res.socket.server.io;
};
