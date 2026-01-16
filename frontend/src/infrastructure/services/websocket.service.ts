import { io, Socket } from 'socket.io-client';

export interface MoveCardData {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  newIndex: number;
  boardId: string;
}

// Export interfaces
export interface CardMovedEvent {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  newOrder: number;
  boardId: string;
  movedBy: string;
  timestamp: Date;
}

export interface UserJoinedEvent {
  userId: string;
  userRole?: string;
  timestamp: Date;
}

export interface UserLeftEvent {
  userId: string;
  timestamp: Date;
}

export class WebSocketService {
  private socket: Socket | null = null;
  private boardId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Callbacks
  private onCardMoved?: (event: CardMovedEvent) => void;
  private onUserJoined?: (event: UserJoinedEvent) => void;
  private onUserLeft?: (event: UserLeftEvent) => void;
  private onConnected?: () => void;
  private onDisconnected?: () => void;
  private onError?: (error: any) => void;

  constructor() {
    this.setupSocket();
  }

  private setupSocket() {
    // Usar caminho relativo para permitir proxy do Vite
    // Em desenvolvimento: proxy para localhost:3000
    // Em produção: usar variável de ambiente
    const serverUrl = import.meta.env.VITE_API_URL || '/';

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket conectado:', this.socket?.id);
      this.reconnectAttempts = 0;
      this.onConnected?.();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket desconectado:', reason);
      this.onDisconnected?.();

      // Tentar reconectar automaticamente
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        this.attemptReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erro de conexão WebSocket:', error);
      this.onError?.(error);
      this.attemptReconnect();
    });

    // Eventos do Kanban
    this.socket.on('card:moved', (event: CardMovedEvent) => {
      console.log('Card movido via WebSocket:', event);
      this.onCardMoved?.(event);
    });

    this.socket.on('board:userJoined', (event: UserJoinedEvent) => {
      console.log('Usuário entrou no board:', event);
      this.onUserJoined?.(event);
    });

    this.socket.on('board:userLeft', (event: UserLeftEvent) => {
      console.log('Usuário saiu do board:', event);
      this.onUserLeft?.(event);
    });

    // Eventos de resposta
    this.socket.on('board:joined', (data) => {
      console.log('Entrou no board:', data);
    });

    this.socket.on('board:left', (data) => {
      console.log('Saiu do board:', data);
    });

    this.socket.on('card:moveSuccess', (data) => {
      console.log('Movimento de card bem-sucedido:', data);
    });

    this.socket.on('card:moveError', (data) => {
      console.error('Erro no movimento de card:', data);
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

      setTimeout(() => {
        this.socket?.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Máximo de tentativas de reconexão atingido');
    }
  }

  // Métodos públicos
  joinBoard(boardId: string, userId: string, userRole?: string) {
    if (this.boardId) {
      this.leaveBoard();
    }

    this.boardId = boardId;
    this.socket?.emit('board:join', { boardId, userId, userRole });
  }

  leaveBoard() {
    if (this.boardId && this.socket) {
      this.socket.emit('board:leave', { boardId: this.boardId });
      this.boardId = null;
    }
  }

  moveCard(data: MoveCardData) {
    this.socket?.emit('card:move', data);
  }

  // Setters para callbacks
  setOnCardMoved(callback: (event: CardMovedEvent) => void) {
    this.onCardMoved = callback;
  }

  setOnUserJoined(callback: (event: UserJoinedEvent) => void) {
    this.onUserJoined = callback;
  }

  setOnUserLeft(callback: (event: UserLeftEvent) => void) {
    this.onUserLeft = callback;
  }

  setOnConnected(callback: () => void) {
    this.onConnected = callback;
  }

  setOnDisconnected(callback: () => void) {
    this.onDisconnected = callback;
  }

  setOnError(callback: (error: any) => void) {
    this.onError = callback;
  }

  // Estado da conexão
  get isConnected(): boolean {
    return this.socket?.connected || false;
  }

  get currentBoardId(): string | null {
    return this.boardId;
  }

  // Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.boardId = null;
  }
}

// Singleton
let websocketServiceInstance: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
  if (!websocketServiceInstance) {
    websocketServiceInstance = new WebSocketService();
  }
  return websocketServiceInstance;
};
