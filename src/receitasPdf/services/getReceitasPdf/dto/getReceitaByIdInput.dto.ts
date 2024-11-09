import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetLaudosInputDto {
  atestados: Laudos[];
  receitas: Laudos[];
  pedidos_exames: Laudos[];
  email: string;
}

export class Laudos {
  @IsString()
  @IsNotEmpty()
  paciente: string;

  @IsString()
  @IsNotEmpty()
  medico: string;

  @IsString()
  @IsNotEmpty()
  data_criacao: string;

  @IsString()
  @IsNotEmpty()
  assinatura: string;

  @IsString()
  @IsOptional()
  medicamento: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
