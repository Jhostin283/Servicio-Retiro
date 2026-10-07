import { ConsultarRetiroCasoUso } from './consultar-retiro.caso-uso';
import { RepositorioRetiroPuerto } from '../../domain/ports/output/repositorio-retiro.puerto';
import { Retiro } from '../../domain/models/retiro.modelo';
import { MontoUSD } from '../../domain/value-objects/monto-usd.vo';
import { NotFoundException } from '@nestjs/common';

describe('ConsultarRetiroCasoUso (Capa de Aplicación)', () => {
  let casoUso: ConsultarRetiroCasoUso;
  let mockRepositorio: jest.Mocked<RepositorioRetiroPuerto>;

  const retiroPrueba = Retiro.crearNuevo('usr-100', MontoUSD.crear(200), 'CHASE', '11223344');

  beforeEach(() => {
    mockRepositorio = {
      guardar: jest.fn(),
      buscarPorId: jest.fn().mockImplementation((id: string) =>
        Promise.resolve(id === retiroPrueba.id ? retiroPrueba : null),
      ),
      buscarPorUsuarioId: jest.fn().mockResolvedValue([retiroPrueba]),
      actualizar: jest.fn(),
    };

    casoUso = new ConsultarRetiroCasoUso(mockRepositorio);
  });

  it('debe obtener un retiro por su ID UUID', async () => {
    const res = await casoUso.obtenerPorId(retiroPrueba.id);
    expect(res).toBe(retiroPrueba);
  });

  it('debe lanzar NotFoundException si el ID no existe', async () => {
    await expect(casoUso.obtenerPorId('id-inexistente')).rejects.toThrow(NotFoundException);
  });

  it('debe listar los retiros de un usuario por su usuarioId', async () => {
    const lista = await casoUso.obtenerPorUsuarioId('usr-100');
    expect(lista.length).toBe(1);
    expect(lista[0].usuarioId).toBe('usr-100');
  });
});
