'use client';

import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInitializer = async () => {
      // Inicializar endpoint de socket
      await fetch('/api/socket');

      socket = io({
        path: '/api/socket',
      });

      socket.on('connect', () => {
        console.log('Socket conectado');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Socket desconectado');
        setIsConnected(false);
      });
    };

    if (!socket) {
      socketInitializer();
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  const emitSenhaChamada = (senha: any) => {
    if (socket) {
      socket.emit('senha-chamada', senha);
    }
  };

  const onSenhaChamada = (callback: (senha: any) => void) => {
    if (socket) {
      socket.on('senha-chamada', callback);
    }
  };

  const offSenhaChamada = () => {
    if (socket) {
      socket.off('senha-chamada');
    }
  };

  return {
    socket,
    isConnected,
    emitSenhaChamada,
    onSenhaChamada,
    offSenhaChamada,
  };
};
