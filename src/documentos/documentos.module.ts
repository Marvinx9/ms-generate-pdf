import { Module } from '@nestjs/common';
import { DocumentosServiceModule } from './services/documentosService.module';

@Module({
  imports: [DocumentosServiceModule],
  exports: [DocumentosServiceModule],
})
export class DocumentosModule {}
