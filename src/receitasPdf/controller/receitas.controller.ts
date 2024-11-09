import { Body, Controller, Post, StreamableFile } from '@nestjs/common';
import { GetLaudosInputDto } from '../services/getReceitasPdf/dto/getReceitaByIdInput.dto';
import { GetLaudoByIdService } from '../services/getReceitasPdf/service/getReceitaByIdService';
import { Readable } from 'stream';

@Controller('receitas')
export class ReceitasController {
  constructor(private readonly getLaudoByIdService: GetLaudoByIdService) {}

  @Post()
  async getLaudosPdf(@Body() dto: GetLaudosInputDto): Promise<StreamableFile> {
    const pdfBuffer = await this.getLaudoByIdService.execute(dto);

    const stream = new Readable();
    stream.push(pdfBuffer);
    stream.push(null);

    return new StreamableFile(stream, {
      type: 'application/pdf',
      disposition: 'inline; filename="laudo.pdf"',
    });
  }
}
