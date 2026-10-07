import { Retiro } from '../../models/retiro.modelo';

export const PUBLICADOR_EVENTOS_PUERTO = Symbol('PublicadorEventosPuerto');

export interface PublicadorEventosPuerto {
  publicarRetiroSolicitado(retiro: Retiro): Promise<void>;
  publicarRetiroCompletado(retiro: Retiro): Promise<void>;
  publicarRetiroFallido(retiro: Retiro): Promise<void>;
}
