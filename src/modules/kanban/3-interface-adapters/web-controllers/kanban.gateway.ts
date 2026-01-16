import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/3-interface-adapters/guards/jwt-auth.guard';
import type { MoveCardUseCase } from '../../2-application';
import { KANBAN_TOKENS } from '../../4-infrastructure';
import { MoveCardRequestDto } from '../api-dto/move-card-request.dto';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Em produção, configure corretamente
  },
})
export class KanbanGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Mapa para controlar usuários conectados por board
  private boardRooms: Map<string, Set<string>> = new Map();

  constructor(
    @Inject(KANBAN_TOKENS.MOVE_CARD_USECASE)
    private readonly moveCardUseCase: MoveCardUseCase,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    console.log(`Cliente conectado: ${client.id}`);
    // Aqui seria implementada a autenticação JWT via handshake
    // Por enquanto, permitimos conexões anônimas para desenvolvimento
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    console.log(`Cliente desconectado: ${client.id}`);

    // Remover cliente de todas as salas
    for (const [boardId, clients] of this.boardRooms.entries()) {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        if (clients.size === 0) {
          this.boardRooms.delete(boardId);
        }
        // Notificar outros clientes na sala
        client.to(`board-${boardId}`).emit('board:userLeft', {
          userId: client.userId,
          timestamp: new Date(),
        });
      }
    }
  }

  @SubscribeMessage('board:join')
  async handleJoinBoard(
    @MessageBody() data: { boardId: string; userId?: string; userRole?: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { boardId, userId, userRole } = data;

    // Armazenar informações do usuário no socket
    client.userId = userId;
    client.userRole = userRole;

    // Entrar na sala do board
    const roomName = `board-${boardId}`;
    await client.join(roomName);

    // Registrar cliente na sala
    if (!this.boardRooms.has(boardId)) {
      this.boardRooms.set(boardId, new Set());
    }
    this.boardRooms.get(boardId)?.add(client.id);

    // Confirmar entrada para o cliente
    client.emit('board:joined', {
      boardId,
      success: true,
      timestamp: new Date(),
    });

    // Notificar outros clientes na sala
    client.to(roomName).emit('board:userJoined', {
      userId,
      userRole,
      timestamp: new Date(),
    });

    console.log(`Usuário ${userId} entrou no board ${boardId}`);
  }

  @SubscribeMessage('board:leave')
  async handleLeaveBoard(
    @MessageBody() data: { boardId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { boardId } = data;

    // Sair da sala
    const roomName = `board-${boardId}`;
    await client.leave(roomName);

    // Remover cliente da sala
    const clients = this.boardRooms.get(boardId);
    if (clients) {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.boardRooms.delete(boardId);
      }
    }

    // Notificar outros clientes
    client.to(roomName).emit('board:userLeft', {
      userId: client.userId,
      timestamp: new Date(),
    });

    // Confirmar saída para o cliente
    client.emit('board:left', {
      boardId,
      success: true,
      timestamp: new Date(),
    });

    console.log(`Usuário ${client.userId} saiu do board ${boardId}`);
  }

  @SubscribeMessage('card:move')
  async handleMoveCard(
    @MessageBody() data: MoveCardRequestDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      console.log(`Movendo card:`, data);

      // Executar o caso de uso
      const result = await this.moveCardUseCase.execute(data);

      // Preparar dados do evento
      const movedEvent = {
        cardId: data.cardId,
        fromColumnId: data.fromColumnId,
        toColumnId: data.toColumnId,
        newOrder: result.newOrder,
        boardId: data.boardId,
        movedBy: client.userId,
        timestamp: new Date(),
      };

      // Emitir para todos os clientes na sala do board (exceto o emissor)
      const roomName = `board-${data.boardId}`;
      client.to(roomName).emit('card:moved', movedEvent);

      // Confirmar para o cliente emissor
      client.emit('card:moveSuccess', {
        ...movedEvent,
        success: true,
      });

      console.log(`Card ${data.cardId} movido com sucesso`);
    } catch (error) {
      console.error('Erro ao mover card:', error);

      // Notificar erro para o cliente
      client.emit('card:moveError', {
        cardId: data.cardId,
        error: error.message || 'Erro ao mover card',
        timestamp: new Date(),
      });
    }
  }
}
