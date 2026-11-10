import { Controller, Post, Get, Body, Param, Query, BadRequestException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CrearRetiroCasoUso } from '../../application/use-cases/crear-retiro.caso-uso';
import { ConsultarRetiroCasoUso } from '../../application/use-cases/consultar-retiro.caso-uso';
import { CrearRetiroDto } from '../../application/dtos/crear-retiro.dto';
import { RespuestaRetiroDto } from '../../application/dtos/respuesta-retiro.dto';
import { ErrorRespuestaDto } from '../../application/dtos/error-respuesta.dto';
import { Retiro } from '../../domain/models/retiro.modelo';

@ApiTags('Retiros en Dólares (USD)')
@Controller('api/v1/retiros')
export class RetiroHttpControlador {
  constructor(
    private readonly crearRetiroCasoUso: CrearRetiroCasoUso,
    private readonly consultarRetiroCasoUso: ConsultarRetiroCasoUso,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar solicitud de retiro de fondos en Dólares (USD)',
    operationId: 'crearSolicitudRetiro',
    description:
      'Registra un nuevo retiro en estado PENDIENTE, valida las reglas financieras en USD y consulta y debita la billetera USD a través de HTTP.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Solicitud registrada. Revisa el estado devuelto para conocer el resultado.',
    type: RespuestaRetiroDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos o monto fuera de los rangos permitidos en USD.',
    type: ErrorRespuestaDto,
  })
  async crearSolicitud(@Body() dto: CrearRetiroDto): Promise<RespuestaRetiroDto> {
    const retiro = await this.crearRetiroCasoUso.ejecutar(dto);
    return this.mapearADto(retiro);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar detalle y estado de una solicitud de retiro por ID',
    operationId: 'obtenerRetiroPorId',
  })
  @ApiParam({ name: 'id', description: 'UUID del retiro; actualmente la ruta no valida su formato', schema: { type: 'string', format: 'uuid' } })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalle completo del retiro.',
    type: RespuestaRetiroDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Retiro no encontrado.',
    type: ErrorRespuestaDto,
  })
  async obtenerPorId(@Param('id') id: string): Promise<RespuestaRetiroDto> {
    const retiro = await this.consultarRetiroCasoUso.obtenerPorId(id);
    return this.mapearADto(retiro);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar el historial de retiros de un usuario en Dólares USD',
    operationId: 'obtenerRetirosPorUsuarioId',
  })
  @ApiQuery({ name: 'usuarioId', description: 'Identificador del usuario en billetera USD', required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de retiros realizados por el usuario.',
    type: [RespuestaRetiroDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Falta el parámetro usuarioId o está vacío.',
    type: ErrorRespuestaDto,
  })
  async obtenerPorUsuarioId(@Query('usuarioId') usuarioId: string): Promise<RespuestaRetiroDto[]> {
    if (typeof usuarioId !== 'string' || !usuarioId.trim()) {
      throw new BadRequestException('El parámetro usuarioId es obligatorio.');
    }
    const retiros = await this.consultarRetiroCasoUso.obtenerPorUsuarioId(usuarioId);
    return retiros.map((r) => this.mapearADto(r));
  }

  private mapearADto(r: Retiro): RespuestaRetiroDto {
    return {
      id: r.id,
      usuarioId: r.usuarioId,
      montoUSD: r.montoUSD.obtenerValor(),
      moneda: r.moneda,
      cuentaDestino: r.cuentaDestino,
      tipoCuenta: r.tipoCuenta,
      estado: r.estado,
      referenciaBancaria: r.referenciaBancaria,
      razonFallo: r.razonFallo,
      movimientoBilleteraId: r.movimientoBilleteraId,
      billeteraId: r.billeteraId,
      fechaCreacion: r.fechaCreacion,
    };
  }
}
