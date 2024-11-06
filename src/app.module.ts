import { Module } from '@nestjs/common';
import { ReceitasModule } from './receitasPdf/receitas.module';
import { SharedModule } from './shared/shared.module';
import { DocumentosModule } from './documentos/documentos.module';

@Module({
  imports: [SharedModule, ReceitasModule, DocumentosModule],
})
export class AppModule {}
