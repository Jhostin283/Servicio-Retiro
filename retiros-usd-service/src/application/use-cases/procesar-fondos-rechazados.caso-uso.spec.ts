import { ProcesarFondosRechazadosCasoUso } from './procesar-fondos-rechazados.caso-uso';
import { RepositorioRetiroPuerto } from '../../domain/ports/output/repositorio-retiro.puerto';
import { Retiro } from '../../domain/models/retiro.modelo';
import { MontoUSD } from '../../domain/value-objects/monto-usd.vo';
import { EstadoRetiro } from '../../domain/enums/estado-retiro.enum';

describe('ProcesarFondosRechazadosCasoUso (Capa de Aplicación)', () => {
  let casoUso: ProcesarFondosRechazadosCasoUso;
  let mockRepositorio: jest.Mocked<RepositorioRetiroPuerto>;
  let retiroPrueba: Retiro;

  beforeEach(() => {
    retiroPrueba = Retiro.crearNuevo('usr-1', MontoUSD.crear(100), 'CHASE', '987654321');

    mockRepositorio = {
      guardar: jest.fn(),
      buscarPorId: jest.fn().mockImplementation((id: string) =>
        Promise.resolve(id === 'ret-123' ? retiroPrueba : null),
      ),
      buscarPorUsuarioId: jest.fn(),
      actualizar: jest.fn().mockImplementation((r: Retiro) => Promise.resolve(r)),
    };

    casoUso = new ProcesarFondosRechazadosCasoUso(mockRepositorio);
  });

  it('debe actualizar el retiro a estado RECHAZADO con la razón proporcionada', async () => {
    await casoUso.ejecutar('ret-123', 'Saldo insuficiente');

    expect(retiroPrueba.estado).toBe(EstadoRetiro.RECHAZADO);
    expect(retiroPrueba.razonFallo).toBe('Saldo insuficiente');
    expect(mockRepositorio.actualizar).toHaveBeenCalledWith(retiroPrueba);
  });
});
