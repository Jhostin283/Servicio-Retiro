import { ProcesarFondosReservadosCasoUso } from './procesar-fondos-reservados.caso-uso';
import { RepositorioRetiroPuerto } from '../../domain/ports/output/repositorio-retiro.puerto';
import { PasarelaBancariaPuerto } from '../../domain/ports/output/pasarela-bancaria.puerto';
import { PublicadorEventosPuerto } from '../../domain/ports/output/publicador-eventos.puerto';
import { Retiro } from '../../domain/models/retiro.modelo';
import { MontoUSD } from '../../domain/value-objects/monto-usd.vo';
import { EstadoRetiro } from '../../domain/enums/estado-retiro.enum';

describe('ProcesarFondosReservadosCasoUso (Capa de Aplicación)', () => {
  let casoUso: ProcesarFondosReservadosCasoUso;
  let mockRepositorio: jest.Mocked<RepositorioRetiroPuerto>;
  let mockPasarela: jest.Mocked<PasarelaBancariaPuerto>;
  let mockPublicador: jest.Mocked<PublicadorEventosPuerto>;

  let retiroPrueba: Retiro;

  beforeEach(() => {
    retiroPrueba = Retiro.crearNuevo('usr-1', MontoUSD.crear(100), 'CHASE', '987654321');
    Object.defineProperty(retiroPrueba, 'id', { value: 'ret-1' });

    mockRepositorio = {
      guardar: jest.fn(),
      buscarPorId: jest.fn().mockImplementation((id: string) =>
        Promise.resolve(id === 'ret-1' ? retiroPrueba : null),
      ),
      buscarPorUsuarioId: jest.fn(),
      actualizar: jest.fn().mockImplementation((r: Retiro) => Promise.resolve(r)),
    };

    mockPasarela = {
      procesarTransferenciaUSD: jest.fn().mockResolvedValue({
        exitosa: true,
        referenciaBancaria: 'ACH-123',
      }),
    };

    mockPublicador = {
      publicarRetiroSolicitado: jest.fn(),
      publicarRetiroCompletado: jest.fn().mockResolvedValue(undefined),
      publicarRetiroFallido: jest.fn().mockResolvedValue(undefined),
    };

    casoUso = new ProcesarFondosReservadosCasoUso(mockRepositorio, mockPasarela, mockPublicador);
  });

  it('debe marcar el retiro como COMPLETADO y emitir evento si la pasarela responde con éxito', async () => {
    await casoUso.ejecutar('ret-1');

    expect(retiroPrueba.estado).toBe(EstadoRetiro.COMPLETADO);
    expect(retiroPrueba.referenciaBancaria).toBe('ACH-123');
    expect(mockRepositorio.actualizar).toHaveBeenCalledWith(retiroPrueba);
    expect(mockPublicador.publicarRetiroCompletado).toHaveBeenCalledWith(retiroPrueba);
  });

  it('debe marcar el retiro como FALLIDO y emitir evento si la pasarela bancaria falla', async () => {
    mockPasarela.procesarTransferenciaUSD.mockResolvedValueOnce({
      exitosa: false,
      motivoRechazo: 'Cuenta inactiva',
    });

    await casoUso.ejecutar('ret-1');

    expect(retiroPrueba.estado).toBe(EstadoRetiro.FALLIDO);
    expect(retiroPrueba.razonFallo).toBe('Cuenta inactiva');
    expect(mockPublicador.publicarRetiroFallido).toHaveBeenCalledWith(retiroPrueba);
  });
});
