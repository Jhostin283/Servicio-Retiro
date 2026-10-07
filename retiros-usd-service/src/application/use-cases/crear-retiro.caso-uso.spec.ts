import { CrearRetiroCasoUso } from './crear-retiro.caso-uso';
import { RepositorioRetiroPuerto } from '../../domain/ports/output/repositorio-retiro.puerto';
import { PublicadorEventosPuerto } from '../../domain/ports/output/publicador-eventos.puerto';
import { CrearRetiroDto } from '../dtos/crear-retiro.dto';
import { Retiro } from '../../domain/models/retiro.modelo';
import { MontoUSD } from '../../domain/value-objects/monto-usd.vo';

describe('CrearRetiroCasoUso (Capa de Aplicación)', () => {
  let casoUso: CrearRetiroCasoUso;
  let mockRepositorio: jest.Mocked<RepositorioRetiroPuerto>;
  let mockPublicador: jest.Mocked<PublicadorEventosPuerto>;

  beforeEach(() => {
    mockRepositorio = {
      guardar: jest.fn().mockImplementation((r: Retiro) => Promise.resolve(r)),
      buscarPorId: jest.fn(),
      buscarPorUsuarioId: jest.fn(),
      actualizar: jest.fn(),
    };

    mockPublicador = {
      publicarRetiroSolicitado: jest.fn().mockResolvedValue(undefined),
      publicarRetiroCompletado: jest.fn().mockResolvedValue(undefined),
      publicarRetiroFallido: jest.fn().mockResolvedValue(undefined),
    };

    casoUso = new CrearRetiroCasoUso(mockRepositorio, mockPublicador);
  });

  it('debe crear y persistir un retiro en USD y publicar el evento de solicitud', async () => {
    const dto: CrearRetiroDto = {
      usuarioId: '81097d3f-7193-44e3-b20e-d9aeb96b7192',
      montoUSD: 150.5,
      codigoBanco: 'CHASEUS33XXX',
      cuentaDestino: '987654321012',
      tipoCuenta: 'AHORROS',
    };

    const resultado = await casoUso.ejecutar(dto);

    expect(resultado).toBeDefined();
    expect(resultado.usuarioId).toBe(dto.usuarioId);
    expect(resultado.montoUSD.obtenerValor()).toBe(150.5);
    expect(mockRepositorio.guardar).toHaveBeenCalledTimes(1);
    expect(mockPublicador.publicarRetiroSolicitado).toHaveBeenCalledWith(resultado);
  });
});
