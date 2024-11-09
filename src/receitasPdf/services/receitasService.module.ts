import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { ReceitasController } from '../controller/receitas.controller';
import { GetLaudoByIdService } from './getReceitasPdf/service/getReceitaByIdService';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [ReceitasController],
  providers: [GetLaudoByIdService],
})
export class ReceitasServiceModule {}
