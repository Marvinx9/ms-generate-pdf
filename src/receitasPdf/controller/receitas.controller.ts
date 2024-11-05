import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import * as archiver from 'archiver';
import { GetReceitaByIdService } from '../services/getReceitasPdf/service/getReceitaByIdService';
import { GetReceitaByIdInputDto } from '../services/getReceitasPdf/dto/getReceitaByIdInput.dto';

@Controller('receitas')
export class ReceitasController {
  constructor(private readonly getReceitaByIdService: GetReceitaByIdService) {}

  @Get()
  async getReceitasPdf(
    @Query() data: GetReceitaByIdInputDto,
    @Res() response: Response,
  ) {
    const receitas = await this.getReceitaByIdService.execute(data);

    response.setHeader('Content-Type', 'application/zip');
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="receitas.zip"',
    );

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(response);

    receitas.forEach((buffer, index) => {
      archive.append(buffer, { name: `laudo_${index + 1}.pdf` });
    });

    await archive.finalize();
  }
}
