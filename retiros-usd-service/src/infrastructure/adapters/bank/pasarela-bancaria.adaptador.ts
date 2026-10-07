import { Injectable, Logger } from '@nestjs/common';
import { PasarelaBancariaPuerto, ResultadoTransferencia } from '../../../domain/ports/output/pasarela-bancaria.puerto';
import { Retiro } from '../../../domain/models/retiro.modelo';

@Injectable()
export class AdaptadorPasarelaBancaria implements PasarelaBancariaPuerto {
  private readonly logger = new Logger(AdaptadorPasarelaBancaria.name);

  async procesarTransferenciaUSD(retiro: Retiro): Promise<ResultadoTransferencia> {
    this.logger.log(
      `[Pasarela Bancaria USD] Enviando $${retiro.montoUSD.obtenerValor()} USD al banco ${retiro.codigoBanco} (Cuenta: ${retiro.cuentaDestino})`,
    );

    // Validación de estado de cuenta bancaria receptor: Si la cuenta es "0000", se marca rechazada
    if (retiro.cuentaDestino === '0000') {
      return {
        exitosa: false,
        motivoRechazo: 'Cuenta bancaria de destino inactiva o rechazada por el banco receptor',
      };
    }

    const ref = `ACH-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      exitosa: true,
      referenciaBancaria: ref,
    };
  }
}
