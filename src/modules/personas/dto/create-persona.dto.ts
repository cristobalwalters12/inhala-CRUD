/* eslint-disable prettier/prettier */
import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class CreatePersonaDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsString()
  @MinLength(3)
  apellido?: string;

  @IsInt()
  @IsPositive()
  edad?: number;

  @IsString()
  email?: string;
}
