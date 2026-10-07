import { Injectable, Inject, Logger } from '@nestjs/common';
import { REPOSITO_RETIRO_PUERTO, RepositorioRetiroPuerto } from '../../domain/ports/output/repositorio-retiro.puerto';
import { PASARELA_BANCARIA_PUERTO, PasarelaBancariaPuerto } from '../../domain/ports/output/pasarela-bancaria.puerto';
import { PUBLICADOR_EVENTOS_PUERTO, PublicadorEventosPuerto } from '../../domain/ports/output/publicador-eventos.puerto';

@Injectable()
export class ProcesarFondosReservadosCasoUso {
  private readonly logger = new Logger(ProcesarFondosReservadosCasoUso.name);

  constructor(
    @Inject(REPOSITO_RETIRO_PUERTO)
    private readonly repositorio: RepositorioRetiroPuerto,
    @Inject(PASARELA_BANCARIA_PUERTO)
    private readonly pasarelaBancaria: PasarelaBancariaPuerto,
    @Inject(PUBLICADOR_EVENTOS_PUERTO)
    private readonly publicador: PublicadorEventosPuerto,
  ) {}

  async ejecutar(retiroId: string): Promise<void> {
    const retiro = await this.repositorio.buscarPorId(retiroId);
    if (!retiro) {
      this.logger.warn(`[CasoUso: FondosReservados] Retiro id=${retiroId} no encontrado.`);
      return;
    }

    this.logger.log(
      `[CasoUso: FondosReservados] Procesando id=${retiro.id} por $${retiro.montoUSD.obtenerValor()} USD`,
    );

    const resultadoBanco = await this.pasarelaBancaria.procesarTransferenciaUSD(retiro);

    if (resultadoBanco.exitosa) {
      retiro.marcarComoCompletado(resultadoBanco.referenciaBancaria || 'ACH-DIRECT');
      await this.repositorio.actualizar(retiro);
      await this.publicador.publicarRetiroCompletado(retiro);
      this.logger.log(
        `[CasoUso: FondosReservados] Retiro ${retiro.id} COMPLETADO. Ref: ${retiro.referenciaBancaria}`,
      );
    } else {
      retiro.marcarComoFallido(resultadoBanco.motivoRechazo || 'Fallo pasarela bancaria');
      await this.repositorio.actualizar(retiro);
      await this.publicador.publicarRetiroFallido(retiro);
      this.logger.error(
        `[CasoUso: FondosReservados] Retiro ${retiro.id} FALLIDO. Razón: ${retiro.razonFallo}`,
      );
    }
  }
}
