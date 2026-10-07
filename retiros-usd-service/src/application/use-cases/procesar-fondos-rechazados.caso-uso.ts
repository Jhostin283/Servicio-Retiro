import { Injectable, Inject, Logger } from '@nestjs/common';
import { REPOSITO_RETIRO_PUERTO, RepositorioRetiroPuerto } from '../../domain/ports/output/repositorio-retiro.puerto';

@Injectable()
export class ProcesarFondosRechazadosCasoUso {
  private readonly logger = new Logger(ProcesarFondosRechazadosCasoUso.name);

  constructor(
    @Inject(REPOSITO_RETIRO_PUERTO)
    private readonly repositorio: RepositorioRetiroPuerto,
  ) {}

  async ejecutar(retiroId: string, razon: string): Promise<void> {
    const retiro = await this.repositorio.buscarPorId(retiroId);
    if (!retiro) {
      this.logger.warn(
        `[CasoUso: FondosRechazados] Retiro id=${retiroId} rechazado. Razón: ${razon}`,
      );
      return;
    }

    retiro.marcarComoRechazado(razon);
    await this.repositorio.actualizar(retiro);

    this.logger.warn(
      `[CasoUso: FondosRechazados] Retiro id=${retiro.id} rechazado. Razón: ${razon}`,
    );
  }
}
