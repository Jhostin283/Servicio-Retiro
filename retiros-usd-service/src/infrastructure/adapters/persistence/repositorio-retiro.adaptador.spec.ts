import { RepositorioRetiroAdaptador } from './repositorio-retiro.adaptador';
import { Repository } from 'typeorm';
import { EntidadRetiroORM } from './entidad-retiro.orm';
import { Retiro } from '../../../domain/models/retiro.modelo';
import { MontoUSD } from '../../../domain/value-objects/monto-usd.vo';
import { EstadoRetiro } from '../../../domain/enums/estado-retiro.enum';

describe('RepositorioRetiroAdaptador (Infraestructura)', () => {
  let adaptador: RepositorioRetiroAdaptador;
  let mockOrmRepo: jest.Mocked<Repository<EntidadRetiroORM>>;

  const entidadPrueba: EntidadRetiroORM = {
    id: 'ret-123',
    usuarioId: 'usr-1',
    montoUSD: 150.5,
    moneda: 'USD',
    codigoBanco: 'CHASE',
    cuentaDestino: '987654321',
    tipoCuenta: 'AHORROS',
    estado: EstadoRetiro.PENDIENTE,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
  };

  beforeEach(() => {
    mockOrmRepo = {
      save: jest.fn().mockResolvedValue(entidadPrueba),
      findOne: jest.fn().mockImplementation(({ where: { id } }: any) =>
        Promise.resolve(id === 'ret-123' ? entidadPrueba : null),
      ),
      find: jest.fn().mockResolvedValue([entidadPrueba]),
    } as any;

    adaptador = new RepositorioRetiroAdaptador(mockOrmRepo);
  });

  it('debe guardar un retiro y mapearlo de dominio a ORM y viceversa', async () => {
    const retiro = Retiro.crearNuevo('usr-1', MontoUSD.crear(150.5), 'CHASE', '987654321');
    const res = await adaptador.guardar(retiro);

    expect(res).toBeDefined();
    expect(res.id).toBe('ret-123');
    expect(res.montoUSD.obtenerValor()).toBe(150.5);
    expect(mockOrmRepo.save).toHaveBeenCalledTimes(1);
  });

  it('debe buscar un retiro por id', async () => {
    const res = await adaptador.buscarPorId('ret-123');
    expect(res).not.toBeNull();
    expect(res?.id).toBe('ret-123');
  });

  it('debe retornar null si el id no existe', async () => {
    const res = await adaptador.buscarPorId('id-inexistente');
    expect(res).toBeNull();
  });

  it('debe buscar retiros por usuarioId', async () => {
    const res = await adaptador.buscarPorUsuarioId('usr-1');
    expect(res.length).toBe(1);
    expect(res[0].usuarioId).toBe('usr-1');
  });
});
