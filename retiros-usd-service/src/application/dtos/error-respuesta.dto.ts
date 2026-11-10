import { ApiProperty } from '@nestjs/swagger';

/** Forma estándar de errores HTTP de NestJS; la validación puede devolver varios mensajes. */
export class ErrorRespuestaDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: ['El monto mínimo de retiro es de $1.00 USD.'],
  })
  message!: string | string[];

  @ApiProperty({ example: 'Bad Request', required: false })
  error?: string;
}
