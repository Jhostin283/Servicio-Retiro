export enum EstadoRetiro {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADO = 'COMPLETADO',
  RECHAZADO = 'RECHAZADO',
  FALLIDO = 'FALLIDO',
}

export interface CrearRetiroRequest {
  usuarioId: string;
  montoUSD: number;
  codigoBanco: string;
  cuentaDestino: string;
  tipoCuenta?: string;
}

export interface RetiroResponse {
  id: string;
  usuarioId: string;
  montoUSD: number;
  moneda: string;
  codigoBanco: string;
  cuentaDestino: string;
  tipoCuenta: string;
  estado: EstadoRetiro;
  referenciaBancaria?: string;
  razonFallo?: string;
  fechaCreacion?: string;
}
