import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { ReceitasController } from '../controller/receitas.controller';
import { GetReceitaByIdService } from './getReceitasPdf/service/getReceitaByIdService';
import { GetReceitaByIdRepository } from './getReceitasPdf/repository/getReceitaById.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ReceitasController],
  providers: [GetReceitaByIdService, GetReceitaByIdRepository],
})
export class ReceitasServiceModule {}
