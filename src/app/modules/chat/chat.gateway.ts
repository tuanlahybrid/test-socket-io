import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['polling', 'websocket'],
  allowUpgrades: true,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGatewayLogs');

  afterInit() {
    this.logger.log('Chat gateway initial.');
  }

  handleConnection(client: Socket) {
    this.logger.log(`New client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('test_event')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log(`${client.id} sent: `, data);
    client.emit('test', 'hello');
  }
}
