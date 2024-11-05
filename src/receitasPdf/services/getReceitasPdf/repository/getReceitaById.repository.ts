import { Injectable } from '@nestjs/common';
import { GetReceitaByIdOutputDto } from '../dto/getReceitaByIdOutput.dto';
import { DataBaseService } from 'src/shared/database/postgres/database.service';

@Injectable()
export class GetReceitaByIdRepository {
  constructor(private readonly dataBaseService: DataBaseService) {}

  async getReceita(medico: string): Promise<GetReceitaByIdOutputDto[]> {
    const sql = `
            SELECT
                nome,
                data_criacao,
                assinatura,
                medicamento,
                observacao
            FROM RECEITAS
            WHERE upper(nome) LIKE ('${medico.toUpperCase()}%')
            `;

    return await this.dataBaseService.query<GetReceitaByIdOutputDto>(sql);
  }
}
