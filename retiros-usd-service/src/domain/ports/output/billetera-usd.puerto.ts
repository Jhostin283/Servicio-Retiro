export const BILLETERA_USD_PUERTO = Symbol('BilleteraUsdPuerto');

export type ResultadoDebito =
  | { estado: 'DEBITADO'; movimientoId: string; billeteraId: string }
  | { estado: 'RECHAZADO'; razon: string }
  | { estado: 'NO_DEBITADO'; razon: string }
  | { estado: 'DESCONOCIDO'; razon: string };

export interface BilleteraUsdPuerto {
  debitar(usuarioId: string, montoUSD: number): Promise<ResultadoDebito>;
}

