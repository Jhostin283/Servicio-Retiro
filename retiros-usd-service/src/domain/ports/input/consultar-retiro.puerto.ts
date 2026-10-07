import { Retiro } from '../../models/retiro.modelo';

export const CONSULTAR_RETIRO_PUERTO = Symbol('ConsultarRetiroPuerto');

export interface ConsultarRetiroPuerto {
  obtenerPorId(id: string): Promise<Retiro>;
  obtenerPorUsuarioId(usuarioId: string): Promise<Retiro[]>;
}
