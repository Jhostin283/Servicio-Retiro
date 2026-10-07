import { Retiro } from './retiro.modelo';
import { MontoUSD } from '../value-objects/monto-usd.vo';
import { EstadoRetiro } from '../enums/estado-retiro.enum';

describe('Retiro (Modelo de Dominio)', () => {
  it('debe instanciar un retiro en estado PENDIENTE con moneda USD', () => {
    const monto = MontoUSD.crear(100.0);
    const retiro = Retiro.crearNuevo('usr-123', monto, 'CHASE', '987654321');

    expect(retiro.id).toBeDefined();
    expect(retiro.usuarioId).toBe('usr-123');
    expect(retiro.montoUSD.obtenerValor()).toBe(100.0);
    expect(retiro.moneda).toBe('USD');
    expect(retiro.estado).toBe(EstadoRetiro.PENDIENTE);
  });

  it('debe cambiar el estado a COMPLETADO al registrar referencia bancaria', () => {
    const monto = MontoUSD.crear(100.0);
    const retiro = Retiro.crearNuevo('usr-123', monto, 'CHASE', '987654321');
    retiro.marcarComoCompletado('REF-ACH-999');

    expect(retiro.estado).toBe(EstadoRetiro.COMPLETADO);
    expect(retiro.referenciaBancaria).toBe('REF-ACH-999');
  });

  it('debe cambiar el estado a FALLIDO al registrar la razón', () => {
    const monto = MontoUSD.crear(100.0);
    const retiro = Retiro.crearNuevo('usr-123', monto, 'CHASE', '987654321');
    retiro.marcarComoFallido('Cuenta destino bloqueada');

    expect(retiro.estado).toBe(EstadoRetiro.FALLIDO);
    expect(retiro.razonFallo).toBe('Cuenta destino bloqueada');
  });
});
