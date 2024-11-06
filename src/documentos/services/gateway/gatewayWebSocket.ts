import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class DocumentGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private documentContent = '';

  handleConnection(client: Socket) {
    client.emit('document_update', this.documentContent);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('edit_document')
  handleEdit(@MessageBody() content: string): void {
    this.documentContent = content;

    this.server.emit('document_update', this.documentContent);
  }
}
