import { Injectable, Inject, Logger } from '@nestjs/common';
import { Retiro } from '../../domain/models/retiro.modelo';
import { MontoUSD } from '../../domain/value-objects/monto-usd.vo';
import { REPOSITO_RETIRO_PUERTO, RepositorioRetiroPuerto } from '../../domain/ports/output/repositorio-retiro.puerto';
import { BILLETERA_USD_PUERTO, BilleteraUsdPuerto } from '../../domain/ports/output/billetera-usd.puerto';
import { PASARELA_BANCARIA_PUERTO, PasarelaBancariaPuerto } from '../../domain/ports/output/pasarela-bancaria.puerto';
import { CrearRetiroDto } from '../dtos/crear-retiro.dto';

@Injectable()
export class CrearRetiroCasoUso {
  private readonly logger = new Logger(CrearRetiroCasoUso.name);

  constructor(
    @Inject(REPOSITO_RETIRO_PUERTO) private readonly repositorio: RepositorioRetiroPuerto,
    @Inject(BILLETERA_USD_PUERTO) private readonly billetera: BilleteraUsdPuerto,
    @Inject(PASARELA_BANCARIA_PUERTO) private readonly pasarela: PasarelaBancariaPuerto,
  ) {}

  async ejecutar(dto: CrearRetiroDto): Promise<Retiro> {
    const retiro = await this.repositorio.guardar(Retiro.crearNuevo(
      dto.usuarioId, MontoUSD.crear(dto.montoUSD), dto.cuentaDestino, dto.tipoCuenta || 'AHORROS',
    ));

    const debito = await this.billetera.debitar(retiro.usuarioId, retiro.montoUSD.obtenerValor());
    if (debito.estado === 'RECHAZADO') {
      retiro.marcarComoRechazado(debito.razon);
      return this.repositorio.actualizar(retiro);
    }
    if (debito.estado === 'NO_DEBITADO') {
      retiro.marcarComoFallido(debito.razon);
      return this.repositorio.actualizar(retiro);
    }
    if (debito.estado === 'DESCONOCIDO') {
      retiro.razonFallo = debito.razon;
      this.logger.warn(`Retiro ${retiro.id}: débito incierto; no reintentar automáticamente.`);
      return this.repositorio.actualizar(retiro);
    }

    retiro.movimientoBilleteraId = debito.movimientoId;
    retiro.billeteraId = debito.billeteraId;
    // Registrar el débito antes del desembolso para facilitar la conciliación manual.
    await this.repositorio.actualizar(retiro);

    try {
      const banco = await this.pasarela.procesarTransferenciaUSD(retiro);
      if (banco.exitosa) {
        retiro.marcarComoCompletado(banco.referenciaBancaria || 'ACH-DIRECT');
      } else {
        retiro.marcarComoFallido(`Saldo debitado: devolución manual necesaria. ${banco.motivoRechazo || 'Falló la pasarela'}`.slice(0, 255));
      }
    } catch {
      retiro.marcarComoFallido('Falló la pasarela. Saldo debitado: devolución manual necesaria.');
    }
    return this.repositorio.actualizar(retiro);
  }
}
