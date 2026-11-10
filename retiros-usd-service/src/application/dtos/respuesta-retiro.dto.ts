import { ApiProperty } from '@nestjs/swagger';
import { EstadoRetiro } from '../../domain/enums/estado-retiro.enum';

export class RespuestaRetiroDto {
  @ApiProperty({ format: 'uuid', example: 'e8a11223-99aa-44bb-88cc-112233445566' })
  id!: string;

  @ApiProperty({ example: 'd3b07384-d113-46e4-a123-561234567890' })
  usuarioId!: string;

  @ApiProperty({ example: 150.50 })
  montoUSD!: number;

  @ApiProperty({ example: 'USD' })
  moneda!: string;

  @ApiProperty({ example: '987654321012' })
  cuentaDestino!: string;

  @ApiProperty({ example: 'AHORROS' })
  tipoCuenta!: string;

  @ApiProperty({ enum: EstadoRetiro, example: EstadoRetiro.PENDIENTE })
  estado!: EstadoRetiro;

  @ApiProperty({ required: false, description: 'Identificador del débito confirmado en billetera USD' })
  movimientoBilleteraId?: string;

  @ApiProperty({ required: false, description: 'Identificador de la billetera debitada' })
  billeteraId?: string;

  @ApiProperty({ example: 'ACH-88991122', required: false, nullable: true })
  referenciaBancaria?: string;

  @ApiProperty({ example: 'Fondos insuficientes', required: false, nullable: true })
  razonFallo?: string;

  @ApiProperty({ format: 'date-time', example: '2026-10-06T15:00:00.000Z' })
  fechaCreacion!: string;
}
