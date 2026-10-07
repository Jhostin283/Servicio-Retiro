import { Retiro } from '../../models/retiro.modelo';

export const REPOSITO_RETIRO_PUERTO = Symbol('RepositorioRetiroPuerto');

export interface RepositorioRetiroPuerto {
  guardar(retiro: Retiro): Promise<Retiro>;
  buscarPorId(id: string): Promise<Retiro | null>;
  buscarPorUsuarioId(usuarioId: string): Promise<Retiro[]>;
  actualizar(retiro: Retiro): Promise<Retiro>;
}
