import { Controller, Post, Get, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CrearRetiroCasoUso } from '../../application/use-cases/crear-retiro.caso-uso';
import { ConsultarRetiroCasoUso } from '../../application/use-cases/consultar-retiro.caso-uso';
import { CrearRetiroDto } from '../../application/dtos/crear-retiro.dto';
import { RespuestaRetiroDto } from '../../application/dtos/respuesta-retiro.dto';
import { Retiro } from '../../domain/models/retiro.modelo';

@ApiTags('Retiros en Dólares (USD)')
@Controller('retiros')
export class RetiroHttpControlador {
  constructor(
    private readonly crearRetiroCasoUso: CrearRetiroCasoUso,
    private readonly consultarRetiroCasoUso: ConsultarRetiroCasoUso,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar solicitud de retiro de fondos en Dólares (USD)',
    description:
      'Registra un nuevo retiro en estado PENDIENTE, valida las reglas financieras en USD y emite la solicitud al microservicio de Billetera a través de RabbitMQ.',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Solicitud de retiro aceptada y puesta en proceso de reserva de saldo.',
    type: RespuestaRetiroDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos o monto fuera de los rangos permitidos en USD.',
  })
  async crearSolicitud(@Body() dto: CrearRetiroDto): Promise<RespuestaRetiroDto> {
    const retiro = await this.crearRetiroCasoUso.ejecutar(dto);
    return this.mapearADto(retiro);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar detalle y estado de una solicitud de retiro por ID',
  })
  @ApiParam({ name: 'id', description: 'UUID único de la transacción de retiro' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalle completo del retiro.',
    type: RespuestaRetiroDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Retiro no encontrado.',
  })
  async obtenerPorId(@Param('id') id: string): Promise<RespuestaRetiroDto> {
    const retiro = await this.consultarRetiroCasoUso.obtenerPorId(id);
    return this.mapearADto(retiro);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({
    summary: 'Listar el historial de retiros de un usuario en Dólares USD',
  })
  @ApiParam({ name: 'usuarioId', description: 'UUID del usuario en el sistema' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de retiros realizados por el usuario.',
    type: [RespuestaRetiroDto],
  })
  async obtenerPorUsuarioId(@Param('usuarioId') usuarioId: string): Promise<RespuestaRetiroDto[]> {
    const retiros = await this.consultarRetiroCasoUso.obtenerPorUsuarioId(usuarioId);
    return retiros.map((r) => this.mapearADto(r));
  }

  private mapearADto(r: Retiro): RespuestaRetiroDto {
    return {
      id: r.id,
      usuarioId: r.usuarioId,
      montoUSD: r.montoUSD.obtenerValor(),
      moneda: r.moneda,
      codigoBanco: r.codigoBanco,
      cuentaDestino: r.cuentaDestino,
      tipoCuenta: r.tipoCuenta,
      estado: r.estado,
      referenciaBancaria: r.referenciaBancaria,
      razonFallo: r.razonFallo,
      fechaCreacion: r.fechaCreacion,
    };
  }
}
