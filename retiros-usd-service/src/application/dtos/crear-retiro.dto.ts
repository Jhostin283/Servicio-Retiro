import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, Max, MaxLength, IsOptional } from 'class-validator';

export class CrearRetiroDto {
  @ApiProperty({
    description: 'Identificador del usuario en billetera USD (alias o UUID)',
    example: 'd3b07384-d113-46e4-a123-561234567890',
    maxLength: 100,
    minLength: 1,
  })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  usuarioId!: string;

  @ApiProperty({
    description: 'Monto a retirar expresado en Dólares (USD). Mínimo $1.00, Máximo $10,000.00.',
    example: 150.50,
    minimum: 1,
    maximum: 10000,
    multipleOf: 0.01,
  })
  @IsNumber({}, { message: 'El montoUSD debe ser un número válido.' })
  @Min(1.0, { message: 'El monto mínimo de retiro es de $1.00 USD.' })
  @Max(10000.0, { message: 'El monto máximo de retiro permitido es de $10,000.00 USD.' })
  montoUSD!: number;

  @ApiProperty({
    description: 'Número de cuenta de destino',
    example: '987654321012',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  cuentaDestino!: string;

  @ApiProperty({
    description: 'Tipo de cuenta bancaria (AHORROS / CORRIENTE)',
    example: 'AHORROS',
    required: false,
    default: 'AHORROS',
  })
  @IsString()
  @IsOptional()
  tipoCuenta?: string;
}
