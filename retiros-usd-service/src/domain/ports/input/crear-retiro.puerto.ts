import { Retiro } from '../../models/retiro.modelo';

export const CREAR_RETIRO_PUERTO = Symbol('CrearRetiroPuerto');

export interface CrearRetiroPuerto {
  ejecutar(dto: any): Promise<Retiro>;
}
