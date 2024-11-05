import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GetReceitaByIdRepository } from '../repository/getReceitaById.repository';
import { GetReceitaByIdInputDto } from '../dto/getReceitaByIdInput.dto';
import * as PDFDocument from 'pdfkit';
import { GetReceitaByIdOutputDto } from '../dto/getReceitaByIdOutput.dto';

@Injectable()
export class GetReceitaByIdService {
  private logger = new Logger('GetReceitaByIdService');

  constructor(private getReceitaByIdRepository: GetReceitaByIdRepository) {}

  async execute({ medico }: GetReceitaByIdInputDto): Promise<Buffer[]> {
    try {
      const receitas = await this.getReceitaByIdRepository.getReceita(medico);
      if (!receitas || receitas.length < 1) {
        throw new NotFoundException('Receita não encontrada para esse médico');
      }

      const pdfBuffers: Buffer[] = [];
      let pdfBuffer: Buffer;
      for (const receita of receitas) {
        pdfBuffer = await this.GenerateReceita(receita);

        pdfBuffers.push(pdfBuffer);
      }
      return pdfBuffers;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Erro ao gerar PDF');
    }
  }

  async convertToPlain(rtf: string): Promise<string> {
    rtf = rtf.replace(/\\par[d]?/g, '');
    return rtf
      .replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, '')
      .trim();
  }

  async ImageAssinatura(
    doc: PDFKit.PDFDocument,
    x = 100,
    y = 370,
    w = 100,
    h = 100,
    imagePath = 'src/shared/public/img/assinaturaMaria.png',
  ) {
    try {
      return doc.image(imagePath, x, doc.page.height - y, {
        width: w,
        height: h,
      });
    } catch (error) {
      console.error('Erro ao adicionar a imagem de assinatura ao PDF:', error);
      throw new Error('Erro ao processar a assinatura.');
    }
  }

  async GenerateReceita(data: GetReceitaByIdOutputDto): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      doc.fontSize(18).text('Receita Médica', { align: 'center' });
      doc.moveDown().moveDown();

      doc.fontSize(12).text(`Nome do Médico: ${data.nome}`);
      doc.moveDown();

      const dataAtual = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      doc.fontSize(12).text(`Data: ${dataAtual}`, { align: 'right' });
      doc.moveDown();

      doc.fontSize(14).text('Medicamento Prescrito:', { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(`${data.medicamento}`);
      doc.moveDown();

      if (data.observacao) {
        doc.moveDown();
        doc.fontSize(14).text('Instruções de Uso:', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(`${data.observacao}`);
        doc.moveDown();
      }

      doc.moveDown().moveDown();
      doc.text(`_________________${data.assinatura}________________`, {
        align: 'center',
      });
      doc.moveDown();
      doc.text('Assinatura do Médico', { align: 'right' });
      doc.moveDown();

      doc.end();
    });
  }
}
