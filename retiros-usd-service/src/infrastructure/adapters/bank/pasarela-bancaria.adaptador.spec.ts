import { AdaptadorPasarelaBancaria } from './pasarela-bancaria.adaptador';
import { Retiro } from '../../../domain/models/retiro.modelo';
import { MontoUSD } from '../../../domain/value-objects/monto-usd.vo';

describe('AdaptadorPasarelaBancaria (Infraestructura)', () => {
  let adaptador: AdaptadorPasarelaBancaria;

  beforeEach(() => {
    adaptador = new AdaptadorPasarelaBancaria();
  });

  it('debe retornar transferencia exitosa para cuentas normales', async () => {
    const retiro = Retiro.crearNuevo('usr-1', MontoUSD.crear(100), 'CHASE', '987654321');
    const res = await adaptador.procesarTransferenciaUSD(retiro);

    expect(res.exitosa).toBe(true);
    expect(res.referenciaBancaria).toMatch(/^ACH-/);
  });

  it('debe retornar rechazo bancario si la cuenta destino es "0000"', async () => {
    const retiro = Retiro.crearNuevo('usr-1', MontoUSD.crear(50), 'WELLSFARGO', '0000');
    const res = await adaptador.procesarTransferenciaUSD(retiro);

    expect(res.exitosa).toBe(false);
    expect(res.motivoRechazo).toBeDefined();
  });
});
