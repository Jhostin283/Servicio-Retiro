import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Retiro } from '../../domain/models/retiro.modelo';
import { REPOSITO_RETIRO_PUERTO, RepositorioRetiroPuerto } from '../../domain/ports/output/repositorio-retiro.puerto';

@Injectable()
export class ConsultarRetiroCasoUso {
  constructor(
    @Inject(REPOSITO_RETIRO_PUERTO)
    private readonly repositorio: RepositorioRetiroPuerto,
  ) {}

  async obtenerPorId(id: string): Promise<Retiro> {
    const retiro = await this.repositorio.buscarPorId(id);
    if (!retiro) {
      throw new NotFoundException(`No se encontró ningún retiro registrado con el ID '${id}'.`);
    }
    return retiro;
  }

  async obtenerPorUsuarioId(usuarioId: string): Promise<Retiro[]> {
    return this.repositorio.buscarPorUsuarioId(usuarioId);
  }
}
