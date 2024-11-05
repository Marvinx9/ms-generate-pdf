import { Module } from '@nestjs/common';
import { ReceitasServiceModule } from './services/receitasService.module';

@Module({
  imports: [ReceitasServiceModule],
  exports: [ReceitasServiceModule],
})
export class ReceitasModule {}
