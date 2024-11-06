import { Module } from '@nestjs/common';
import { DocumentGateway } from './gateway/gatewayWebSocket';
import { CollabGateway } from './collad/collab.gateway';

@Module({
  providers: [DocumentGateway, CollabGateway],
})
export class DocumentosServiceModule {}
