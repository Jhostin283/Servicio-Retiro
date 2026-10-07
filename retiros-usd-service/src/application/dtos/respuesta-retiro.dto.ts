import { ApiProperty } from '@nestjs/swagger';
import { EstadoRetiro } from '../../domain/enums/estado-retiro.enum';

export class RespuestaRetiroDto {
  @ApiProperty({ example: 'ret-12345678-uuid' })
  id!: string;

  @ApiProperty({ example: 'd3b07384-d113-46e4-a123-561234567890' })
  usuarioId!: string;

  @ApiProperty({ example: 150.50 })
  montoUSD!: number;

  @ApiProperty({ example: 'USD' })
  moneda!: string;

  @ApiProperty({ example: 'CHASEUS33XXX' })
  codigoBanco!: string;

  @ApiProperty({ example: '987654321012' })
  cuentaDestino!: string;

  @ApiProperty({ example: 'AHORROS' })
  tipoCuenta!: string;

  @ApiProperty({ enum: EstadoRetiro, example: EstadoRetiro.PENDIENTE })
  estado!: EstadoRetiro;

  @ApiProperty({ example: 'ACH-88991122', required: false })
  referenciaBancaria?: string;

  @ApiProperty({ example: 'Fondos insuficientes', required: false })
  razonFallo?: string;

  @ApiProperty({ example: '2026-10-06T15:00:00.000Z' })
  fechaCreacion!: string;
}
