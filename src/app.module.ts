import { Module } from '@nestjs/common';
import { ReceitasModule } from './receitasPdf/receitas.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, ReceitasModule],
})
export class AppModule {}
