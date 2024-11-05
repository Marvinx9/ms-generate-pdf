import { IsNotEmpty, IsString } from 'class-validator';

export class GetReceitaByIdInputDto {
  @IsString()
  @IsNotEmpty()
  medico: string;
}
