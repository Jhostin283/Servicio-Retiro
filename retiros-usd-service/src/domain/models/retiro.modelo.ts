import { MontoUSD } from '../value-objects/monto-usd.vo';
import { EstadoRetiro } from '../enums/estado-retiro.enum';

export class Retiro {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly montoUSD: MontoUSD,
    public readonly moneda: string,
    public readonly codigoBanco: string,
    public readonly cuentaDestino: string,
    public readonly tipoCuenta: string,
    public estado: EstadoRetiro,
    public referenciaBancaria?: string,
    public razonFallo?: string,
    public readonly fechaCreacion: string = new Date().toISOString(),
  ) {}

  public static crearNuevo(
    usuarioId: string,
    montoUSD: MontoUSD,
    codigoBanco: string,
    cuentaDestino: string,
    tipoCuenta: string = 'AHORROS',
  ): Retiro {
    return new Retiro(
      crypto.randomUUID(),
      usuarioId,
      montoUSD,
      'USD',
      codigoBanco,
      cuentaDestino,
      tipoCuenta,
      EstadoRetiro.PENDIENTE,
    );
  }

  public marcarComoCompletado(referencia: string): void {
    this.estado = EstadoRetiro.COMPLETADO;
    this.referenciaBancaria = referencia;
  }

  public marcarComoFallido(razon: string): void {
    this.estado = EstadoRetiro.FALLIDO;
    this.razonFallo = razon;
  }

  public marcarComoRechazado(razon: string): void {
    this.estado = EstadoRetiro.RECHAZADO;
    this.razonFallo = razon;
  }
}
