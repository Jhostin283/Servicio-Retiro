import { Test, TestingModule } from '@nestjs/testing';
import { RetiroEventosControlador } from './retiro-eventos.controlador';
import { ProcesarFondosReservadosCasoUso } from '../../application/use-cases/procesar-fondos-reservados.caso-uso';
import { ProcesarFondosRechazadosCasoUso } from '../../application/use-cases/procesar-fondos-rechazados.caso-uso';

describe('RetiroEventosControlador (Infraestructura RabbitMQ)', () => {
  let controlador: RetiroEventosControlador;
  let mockReservadosCasoUso: jest.Mocked<ProcesarFondosReservadosCasoUso>;
  let mockRechazadosCasoUso: jest.Mocked<ProcesarFondosRechazadosCasoUso>;

  beforeEach(async () => {
    mockReservadosCasoUso = {
      ejecutar: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockRechazadosCasoUso = {
      ejecutar: jest.fn().mockResolvedValue(undefined),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetiroEventosControlador],
      providers: [
        { provide: ProcesarFondosReservadosCasoUso, useValue: mockReservadosCasoUso },
        { provide: ProcesarFondosRechazadosCasoUso, useValue: mockRechazadosCasoUso },
      ],
    }).compile();

    controlador = module.get<RetiroEventosControlador>(RetiroEventosControlador);
  });

  it('debe manejar el evento withdrawal.funds_reserved', async () => {
    await controlador.manejarFondosReservados({ id: 'ret-1' });
    expect(mockReservadosCasoUso.ejecutar).toHaveBeenCalledWith('ret-1');
  });

  it('debe manejar el evento withdrawal.funds_rejected', async () => {
    await controlador.manejarFondosRechazados({ id: 'ret-1', razon: 'Saldo insuficiente' });
    expect(mockRechazadosCasoUso.ejecutar).toHaveBeenCalledWith('ret-1', 'Saldo insuficiente');
  });
});
