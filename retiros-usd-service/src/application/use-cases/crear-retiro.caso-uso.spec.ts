import { CrearRetiroCasoUso } from './crear-retiro.caso-uso';
import { Retiro } from '../../domain/models/retiro.modelo';
import { EstadoRetiro } from '../../domain/enums/estado-retiro.enum';

describe('CrearRetiroCasoUso con billetera USD HTTP', () => {
  const dto = { usuarioId: 'mariaperez', montoUSD: 150.5, cuentaDestino: '987654321' };
  let repo: any;
  let billetera: any;
  let banco: any;
  let caso: CrearRetiroCasoUso;
  beforeEach(() => {
    repo = { guardar: jest.fn(async (r: Retiro) => r), actualizar: jest.fn(async (r: Retiro) => r) };
    billetera = { debitar: jest.fn() };
    banco = { procesarTransferenciaUSD: jest.fn() };
    caso = new CrearRetiroCasoUso(repo, billetera, banco);
  });
  it('registra el débito y completa el retiro después del desembolso', async () => {
    billetera.debitar.mockResolvedValue({ estado: 'DEBITADO', movimientoId: 'mov-1', billeteraId: 'wallet-1' });
    banco.procesarTransferenciaUSD.mockResolvedValue({ exitosa: true, referenciaBancaria: 'ref-1' });
    const result = await caso.ejecutar(dto);
    expect(result.estado).toBe(EstadoRetiro.COMPLETADO);
    expect(result.movimientoBilleteraId).toBe('mov-1');
    expect(billetera.debitar).toHaveBeenCalledWith('mariaperez', 150.5);
    expect(repo.actualizar).toHaveBeenCalledTimes(2);
    expect(repo.actualizar.mock.invocationCallOrder[0]).toBeLessThan(banco.procesarTransferenciaUSD.mock.invocationCallOrder[0]);
  });
  it('rechaza fondos insuficientes sin llamar al banco', async () => {
    billetera.debitar.mockResolvedValue({ estado: 'RECHAZADO', razon: 'Saldo insuficiente' });
    expect((await caso.ejecutar(dto)).estado).toBe(EstadoRetiro.RECHAZADO);
    expect(banco.procesarTransferenciaUSD).not.toHaveBeenCalled();
  });
  it('mantiene pendiente un débito incierto sin reintentar ni llamar al banco', async () => {
    billetera.debitar.mockResolvedValue({ estado: 'DESCONOCIDO', razon: 'Revisión manual necesaria' });
    const result = await caso.ejecutar(dto);
    expect(result.estado).toBe(EstadoRetiro.PENDIENTE);
    expect(result.razonFallo).toContain('manual');
    expect(billetera.debitar).toHaveBeenCalledTimes(1);
    expect(banco.procesarTransferenciaUSD).not.toHaveBeenCalled();
  });
  it('marca FALLIDO y deja constancia de la devolución manual cuando falla la pasarela', async () => {
    billetera.debitar.mockResolvedValue({ estado: 'DEBITADO', movimientoId: 'mov-1', billeteraId: 'wallet-1' });
    banco.procesarTransferenciaUSD.mockResolvedValue({ exitosa: false, motivoRechazo: 'Cuenta inactiva' });
    const result = await caso.ejecutar(dto);
    expect(result.estado).toBe(EstadoRetiro.FALLIDO);
    expect(result.movimientoBilleteraId).toBe('mov-1');
    expect(result.razonFallo).toContain('devolución manual');
  });
  it('marca FALLIDO sin contactar al banco si el débito no fue realizado', async () => {
    billetera.debitar.mockResolvedValue({ estado: 'NO_DEBITADO', razon: 'Billetera no disponible' });
    expect((await caso.ejecutar(dto)).estado).toBe(EstadoRetiro.FALLIDO);
    expect(banco.procesarTransferenciaUSD).not.toHaveBeenCalled();
  });
});
