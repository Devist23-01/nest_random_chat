import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'chats' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor() {
    this.logger.log('constructor');
  }

  afterInit() {
    this.logger.log('init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): any {
    this.logger.log(`connect : ${socket.id} ${socket.nsp.name}`);
  }

  handleDisconnect(client: any): any {
    this.logger.log(`disconnected`);
  }

  @SubscribeMessage('new_user')
  handleMessage(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('submit_chat')
  handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('new_chat', {
      chat,
      username: socket.id,
    });
  }
}
