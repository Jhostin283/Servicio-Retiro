import { Injectable, Inject, Logger, Optional } from '@nestjs/common';
import { Retiro } from '../../domain/models/retiro.modelo';
import { MontoUSD } from '../../domain/value-objects/monto-usd.vo';
import { REPOSITO_RETIRO_PUERTO, RepositorioRetiroPuerto } from '../../domain/ports/output/repositorio-retiro.puerto';
import { PUBLICADOR_EVENTOS_PUERTO, PublicadorEventosPuerto } from '../../domain/ports/output/publicador-eventos.puerto';
import { CrearRetiroDto } from '../dtos/crear-retiro.dto';
import { ProcesarFondosReservadosCasoUso } from './procesar-fondos-reservados.caso-uso';
import { ProcesarFondosRechazadosCasoUso } from './procesar-fondos-rechazados.caso-uso';

@Injectable()
export class CrearRetiroCasoUso {
  private readonly logger = new Logger(CrearRetiroCasoUso.name);

  constructor(
    @Inject(REPOSITO_RETIRO_PUERTO)
    private readonly repositorio: RepositorioRetiroPuerto,
    @Inject(PUBLICADOR_EVENTOS_PUERTO)
    private readonly publicador: PublicadorEventosPuerto,
    @Optional()
    private readonly procesarFondosReservadosCasoUso?: ProcesarFondosReservadosCasoUso,
    @Optional()
    private readonly procesarFondosRechazadosCasoUso?: ProcesarFondosRechazadosCasoUso,
  ) {}

  async ejecutar(dto: CrearRetiroDto): Promise<Retiro> {
    const montoVO = MontoUSD.crear(dto.montoUSD);

    const nuevoRetiro = Retiro.crearNuevo(
      dto.usuarioId,
      montoVO,
      dto.codigoBanco,
      dto.cuentaDestino,
      dto.tipoCuenta || 'AHORROS',
    );

    const retiroGuardado = await this.repositorio.guardar(nuevoRetiro);

    this.logger.log(
      `[CasoUso: CrearRetiro] Retiro id=${retiroGuardado.id} guardado en estado PENDIENTE ($${montoVO.obtenerValor()} USD)`,
    );

    await this.publicador.publicarRetiroSolicitado(retiroGuardado);

    // ⚡ Ciclo asíncrono de procesamiento de retiro (Reserva de fondos y confirmación de pasarela bancaria)
    setTimeout(async () => {
      try {
        if (dto.cuentaDestino === '0000') {
          if (this.procesarFondosRechazadosCasoUso) {
            this.logger.warn(`[ServicioRetiros - CicloAsincrono] Rechazando retiro id=${retiroGuardado.id} por cuenta inactiva ('0000')`);
            await this.procesarFondosRechazadosCasoUso.ejecutar(
              retiroGuardado.id,
              'Cuenta bancaria de destino inactiva o rechazada por el banco receptor',
            );
          }
        } else {
          if (this.procesarFondosReservadosCasoUso) {
            this.logger.log(`[ServicioRetiros - CicloAsincrono] Procesando confirmación bancaria para retiro id=${retiroGuardado.id}`);
            await this.procesarFondosReservadosCasoUso.ejecutar(retiroGuardado.id);
          }
        }
      } catch (error) {
        this.logger.error(`Error en ciclo asíncrono de eventos para retiro ${retiroGuardado.id}: ${error}`);
      }
    }, 1500);

    return retiroGuardado;
  }
}


