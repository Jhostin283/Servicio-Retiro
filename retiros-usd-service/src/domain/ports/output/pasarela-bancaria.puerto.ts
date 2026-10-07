import { Retiro } from '../../models/retiro.modelo';

export const PASARELA_BANCARIA_PUERTO = Symbol('PasarelaBancariaPuerto');

export interface ResultadoTransferencia {
  exitosa: boolean;
  referenciaBancaria?: string;
  motivoRechazo?: string;
}

export interface PasarelaBancariaPuerto {
  procesarTransferenciaUSD(retiro: Retiro): Promise<ResultadoTransferencia>;
}
