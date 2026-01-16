import { useEffect, useRef, useState } from 'react';
import { getWebSocketService, WebSocketService } from './websocket.service';
import type { CardMovedEvent, UserJoinedEvent, UserLeftEvent } from './websocket.service';

interface UseWebSocketOptions {
  boardId?: string;
  userId?: string;
  userRole?: string;
  onCardMoved?: (event: CardMovedEvent) => void;
  onUserJoined?: (event: UserJoinedEvent) => void;
  onUserLeft?: (event: UserLeftEvent) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: any) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const wsService = useRef<WebSocketService>(getWebSocketService());
  const [isConnected, setIsConnected] = useState(false);
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);

  // Configurar callbacks
  useEffect(() => {
    const service = wsService.current;

    service.setOnCardMoved((event) => {
      options.onCardMoved?.(event);
    });

    service.setOnUserJoined((event) => {
      options.onUserJoined?.(event);
    });

    service.setOnUserLeft((event) => {
      options.onUserLeft?.(event);
    });

    service.setOnConnected(() => {
      setIsConnected(true);
      options.onConnected?.();
    });

    service.setOnDisconnected(() => {
      setIsConnected(false);
      options.onDisconnected?.();
    });

    service.setOnError((error) => {
      console.warn('WebSocket connection error (backend may not be running):', error);
      // Não propagar erro para não quebrar a UI
      setIsConnected(false);
    });

    // Verificar estado inicial
    setIsConnected(service.isConnected);
    setCurrentBoardId(service.currentBoardId);

    // Cleanup
    return () => {
      // Não desconectar aqui, pois pode ser usado por múltiplos componentes
    };
  }, [options]);

  // Entrar/sair do board quando boardId muda
  useEffect(() => {
    if (options.boardId && options.userId) {
      wsService.current.joinBoard(options.boardId, options.userId, options.userRole);
      setCurrentBoardId(options.boardId);
    } else if (currentBoardId) {
      wsService.current.leaveBoard();
      setCurrentBoardId(null);
    }
  }, [options.boardId, options.userId, options.userRole, currentBoardId]);

  // Método para mover card
  const moveCard = (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number, boardId: string) => {
    wsService.current.moveCard({
      cardId,
      fromColumnId,
      toColumnId,
      newIndex,
      boardId,
    });
  };

  // Cleanup na desmontagem do componente
  useEffect(() => {
    return () => {
      // Só desconectar se for o último uso, mas por simplicidade,
      // mantemos a conexão ativa
    };
  }, []);

  return {
    isConnected,
    currentBoardId,
    moveCard,
    disconnect: () => wsService.current.disconnect(),
  };
};
