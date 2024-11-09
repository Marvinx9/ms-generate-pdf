// import {
//   Injectable,
//   InternalServerErrorException,
//   Logger,
// } from '@nestjs/common';
// import * as PDFDocument from 'pdfkit';
// import { GetLaudosInputDto, Laudos } from '../dto/getReceitaByIdInput.dto';

// @Injectable()
// export class GetLaudoByIdService {
//   private logger = new Logger('GetReceitaOrAtestadoByIdService');
//   constructor() {}

//   async execute(data: GetLaudosInputDto): Promise<Buffer> {
//     try {
//       const doc = new PDFDocument({ size: 'A4', margin: 50 });
//       const buffers: Buffer[] = [];

//       doc.on('data', buffers.push.bind(buffers));
//       doc.on('end', () => {});

//       let isFirstItem = true;
//       if (data.atestados.length > 0) {
//         await this.generateAtestado(isFirstItem, doc, data.atestados);
//       }

//       if (data.receitas.length > 0) {
//         isFirstItem = data.atestados.length > 0 ? false : true;
//         await this.generateReceita(isFirstItem, doc, data.receitas);
//       }

//       if (data.pedidos_exames.length > 0) {
//         isFirstItem =
//           data.atestados.length > 0
//             ? false
//             : data.receitas.length > 0
//               ? false
//               : true;
//         await this.generatePedidosExames(isFirstItem, doc, data.pedidos_exames);
//       }

//       doc.end();

//       return new Promise((resolve) => {
//         doc.on('end', () => {
//           resolve(Buffer.concat(buffers));
//         });
//       });
//     } catch (error) {
//       this.logger.error(error);
//       throw new InternalServerErrorException('Erro ao gerar PDF');
//     }
//   }

//   async generateReceita(
//     isFirstItem: boolean,
//     doc: PDFKit.PDFDocument,
//     data: Laudos[],
//   ) {
//     data.forEach((data, index) => {
//       if (!isFirstItem) {
//         doc.addPage();
//       } else if (index > 0) {
//         doc.addPage();
//         isFirstItem = true;
//       }
//       doc.fontSize(18).text('Receita Médica', { align: 'center' });
//       doc.moveDown(2);

//       doc.fontSize(12).text(`Nome do Médico: ${data.medico}`);
//       doc.moveDown();

//       doc.text(`Data: ${data.data_criacao}`, { align: 'right' });
//       doc.moveDown(2);

//       doc.fontSize(14).text('Medicamento Prescrito:', { underline: true });
//       doc.moveDown();
//       doc.fontSize(12).text(data.content, { align: 'justify' });
//       doc.moveDown(2);

//       doc.text(`______________${data.assinatura}_____________`, {
//         align: 'right',
//       });
//       doc.text('Assinatura do Médico', { align: 'right' });
//       doc.moveDown(3);
//     });
//   }

//   async generateAtestado(
//     isFirstItem: boolean,
//     doc: PDFKit.PDFDocument,
//     data: Laudos[],
//   ) {
//     data.forEach((data, index) => {
//       if (!isFirstItem) {
//         doc.addPage();
//       } else if (index > 0) {
//         doc.addPage();
//         isFirstItem = true;
//       }
//       isFirstItem = false;
//       doc.fontSize(18).text('Atestado Médico', { align: 'center' });
//       doc.moveDown(2);

//       doc.fontSize(12).text(`Nome do Médico: ${data.medico}`);
//       doc.moveDown();

//       doc.fontSize(12).text(`Data: ${data.data_criacao}`, { align: 'right' });
//       doc.moveDown(2);

//       doc.fontSize(12).text(`Paciente: ${data.paciente}`);
//       doc.moveDown(2);

//       const textoAtestado = `${data.content}`;
//       doc.fontSize(14).text(textoAtestado, { align: 'justify' });
//       doc.moveDown(2);

//       doc.text(`______________${data.assinatura}_____________`, {
//         align: 'right',
//       });
//       doc.text('Assinatura do Médico', { align: 'right' });
//       doc.moveDown(3);
//     });
//   }

//   async generatePedidosExames(
//     isFirstItem: boolean,
//     doc: PDFKit.PDFDocument,
//     data: Laudos[],
//   ) {
//     data.forEach((data, index) => {
//       if (!isFirstItem) {
//         doc.addPage();
//       } else if (index > 0) {
//         doc.addPage();
//         isFirstItem = true;
//       }
//       isFirstItem = false;
//       doc.fontSize(18).text('Pedido de Exames', { align: 'center' });
//       doc.moveDown(2);

//       doc.fontSize(12).text(`Nome do Médico: ${data.medico}`);
//       doc.moveDown();

//       doc.text(`Data: ${data.data_criacao}`, { align: 'right' });
//       doc.moveDown(2);

//       doc.fontSize(14).text('Exames Solicitados:', { underline: true });
//       doc.moveDown();
//       doc.fontSize(12).text(data.content, { align: 'justify' });
//       doc.moveDown(2);

//       doc.text(`______________${data.assinatura}_____________`, {
//         align: 'right',
//       });
//       doc.text('Assinatura do Médico', { align: 'right' });
//       doc.moveDown(3);
//     });
//   }
// }

import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { GetLaudosInputDto, Laudos } from '../dto/getReceitaByIdInput.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { Readable } from 'stream';

@Injectable()
export class GetLaudoByIdService {
  private logger = new Logger('GetReceitaOrAtestadoByIdService');

  constructor(private readonly httpService: HttpService) {}

  async execute(data: GetLaudosInputDto): Promise<Buffer> {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {});

      let isFirstItem = true;
      if (data.atestados.length > 0) {
        await this.generateAtestado(isFirstItem, doc, data.atestados);
      }

      if (data.receitas.length > 0) {
        isFirstItem = data.atestados.length > 0 ? false : true;
        await this.generateReceita(isFirstItem, doc, data.receitas);
      }

      if (data.pedidos_exames.length > 0) {
        isFirstItem =
          data.atestados.length > 0
            ? false
            : data.receitas.length > 0
              ? false
              : true;
        await this.generatePedidosExames(isFirstItem, doc, data.pedidos_exames);
      }

      doc.end();

      return new Promise((resolve) => {
        doc.on('end', async () => {
          const pdfBuffer = Buffer.concat(buffers);

          await this.sendPdfToExternalApi(pdfBuffer, data.email);

          resolve(pdfBuffer);
        });
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Erro ao gerar PDF');
    }
  }

  //forma 1
  private async sendPdfToExternalApi(
    pdfBuffer: Buffer,
    email: string,
  ): Promise<void> {
    const url = 'https://api.externa.com/send-pdf';

    const formData = new FormData();

    const stream = new Readable();
    stream.push(pdfBuffer);
    stream.push(null);

    formData.append('file', stream, 'laudo.pdf');
    formData.append('recipient', email);

    const headers = {
      ...formData.getHeaders(),
      Authorization: 'Bearer YOUR_API_KEY',
    };

    const response = await firstValueFrom(
      this.httpService.post(url, formData, { headers }),
    );
    this.logger.log('PDF enviado com sucesso!', response.data);
  }

  // forma 2
  // private async sendPdfToExternalApi(
  //   pdfBuffer: Buffer,
  //   email: string,
  // ): Promise<void> {
  //   const url = 'https://api.externa.com/send-pdf'; // URL da API externa

  //   const formData = new FormData();
  //   formData.append('file', pdfBuffer, 'laudo.pdf');
  //   formData.append('recipient', email);

  //   const headers = {
  //     'Content-Type': 'multipart/form-data', // Tipo do conteúdo
  //     Authorization: 'Bearer YOUR_API_KEY', // Se necessário, insira o token de autenticação
  //   };

  //   const response = await firstValueFrom(
  //     this.httpService.post(url, formData, { headers }),
  //   );

  //   this.logger.log('PDF enviado com sucesso!', response.data);
  // }

  async generateReceita(
    isFirstItem: boolean,
    doc: PDFKit.PDFDocument,
    data: Laudos[],
  ) {
    data.forEach((data, index) => {
      if (!isFirstItem) {
        doc.addPage();
      } else if (index > 0) {
        doc.addPage();
        isFirstItem = true;
      }
      doc.fontSize(18).text('Receita Médica', { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(12).text(`Nome do Médico: ${data.medico}`);
      doc.moveDown();

      doc.text(`Data: ${data.data_criacao}`, { align: 'right' });
      doc.moveDown(2);

      doc.fontSize(14).text('Medicamento Prescrito:', { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(data.content, { align: 'justify' });
      doc.moveDown(2);

      doc.text(`______________${data.assinatura}_____________`, {
        align: 'right',
      });
      doc.text('Assinatura do Médico', { align: 'right' });
      doc.moveDown(3);
    });
  }

  async generateAtestado(
    isFirstItem: boolean,
    doc: PDFKit.PDFDocument,
    data: Laudos[],
  ) {
    data.forEach((data, index) => {
      if (!isFirstItem) {
        doc.addPage();
      } else if (index > 0) {
        doc.addPage();
        isFirstItem = true;
      }
      isFirstItem = false;
      doc.fontSize(18).text('Atestado Médico', { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(12).text(`Nome do Médico: ${data.medico}`);
      doc.moveDown();

      doc.fontSize(12).text(`Data: ${data.data_criacao}`, { align: 'right' });
      doc.moveDown(2);

      doc.fontSize(12).text(`Paciente: ${data.paciente}`);
      doc.moveDown(2);

      const textoAtestado = `${data.content}`;
      doc.fontSize(14).text(textoAtestado, { align: 'justify' });
      doc.moveDown(2);

      doc.text(`______________${data.assinatura}_____________`, {
        align: 'right',
      });
      doc.text('Assinatura do Médico', { align: 'right' });
      doc.moveDown(3);
    });
  }

  async generatePedidosExames(
    isFirstItem: boolean,
    doc: PDFKit.PDFDocument,
    data: Laudos[],
  ) {
    data.forEach((data, index) => {
      if (!isFirstItem) {
        doc.addPage();
      } else if (index > 0) {
        doc.addPage();
        isFirstItem = true;
      }
      isFirstItem = false;
      doc.fontSize(18).text('Pedido de Exames', { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(12).text(`Nome do Médico: ${data.medico}`);
      doc.moveDown();

      doc.text(`Data: ${data.data_criacao}`, { align: 'right' });
      doc.moveDown(2);

      doc.fontSize(14).text('Exames Solicitados:', { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(data.content, { align: 'justify' });
      doc.moveDown(2);

      doc.text(`______________${data.assinatura}_____________`, {
        align: 'right',
      });
      doc.text('Assinatura do Médico', { align: 'right' });
      doc.moveDown(3);
    });
  }
}
