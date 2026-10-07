import { Test, TestingModule } from '@nestjs/testing';
import { RetiroHttpControlador } from './retiro-http.controlador';
import { CrearRetiroCasoUso } from '../../application/use-cases/crear-retiro.caso-uso';
import { ConsultarRetiroCasoUso } from '../../application/use-cases/consultar-retiro.caso-uso';
import { Retiro } from '../../domain/models/retiro.modelo';
import { MontoUSD } from '../../domain/value-objects/monto-usd.vo';

describe('RetiroHttpControlador (Infraestructura HTTP)', () => {
  let controlador: RetiroHttpControlador;
  let mockCrearCasoUso: jest.Mocked<CrearRetiroCasoUso>;
  let mockConsultarCasoUso: jest.Mocked<ConsultarRetiroCasoUso>;

  const retiroPrueba = Retiro.crearNuevo('usr-1', MontoUSD.crear(150.5), 'CHASE', '987654321');

  beforeEach(async () => {
    mockCrearCasoUso = {
      ejecutar: jest.fn().mockResolvedValue(retiroPrueba),
    } as any;

    mockConsultarCasoUso = {
      obtenerPorId: jest.fn().mockResolvedValue(retiroPrueba),
      obtenerPorUsuarioId: jest.fn().mockResolvedValue([retiroPrueba]),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetiroHttpControlador],
      providers: [
        { provide: CrearRetiroCasoUso, useValue: mockCrearCasoUso },
        { provide: ConsultarRetiroCasoUso, useValue: mockConsultarCasoUso },
      ],
    }).compile();

    controlador = module.get<RetiroHttpControlador>(RetiroHttpControlador);
  });

  it('debe registrar un retiro y devolver la DTO serializada', async () => {
    const dto = {
      usuarioId: 'usr-1',
      montoUSD: 150.5,
      codigoBanco: 'CHASE',
      cuentaDestino: '987654321',
    };
    const res = await controlador.crearSolicitud(dto);

    expect(res).toBeDefined();
    expect(res.montoUSD).toBe(150.5);
    expect(mockCrearCasoUso.ejecutar).toHaveBeenCalledWith(dto);
  });

  it('debe consultar un retiro por ID', async () => {
    const res = await controlador.obtenerPorId(retiroPrueba.id);
    expect(res.id).toBe(retiroPrueba.id);
  });

  it('debe consultar retiros por usuarioId', async () => {
    const res = await controlador.obtenerPorUsuarioId('usr-1');
    expect(res.length).toBe(1);
    expect(res[0].usuarioId).toBe('usr-1');
  });
});
