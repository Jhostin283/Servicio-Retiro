import { AdaptadorPublicadorRabbitMQ } from './publicador-rabbitmq.adaptador';
import { ClientProxy } from '@nestjs/microservices';
import { Retiro } from '../../../domain/models/retiro.modelo';
import { MontoUSD } from '../../../domain/value-objects/monto-usd.vo';
import { of } from 'rxjs';

describe('AdaptadorPublicadorRabbitMQ (Infraestructura)', () => {
  let adaptador: AdaptadorPublicadorRabbitMQ;
  let mockClienteRmq: jest.Mocked<ClientProxy>;

  const retiroPrueba = Retiro.crearNuevo('usr-1', MontoUSD.crear(100), 'CHASE', '987654321');
  Object.defineProperty(retiroPrueba, 'id', { value: 'ret-1' });

  beforeEach(() => {
    mockClienteRmq = {
      emit: jest.fn().mockReturnValue(of({})),
    } as any;

    adaptador = new AdaptadorPublicadorRabbitMQ(mockClienteRmq);
  });

  it('debe emitir el evento withdrawal.requested', async () => {
    await adaptador.publicarRetiroSolicitado(retiroPrueba);
    expect(mockClienteRmq.emit).toHaveBeenCalledWith('withdrawal.requested', expect.objectContaining({
      evento: 'withdrawal.requested',
      id: 'ret-1',
      montoUSD: 100,
    }));
  });

  it('debe emitir el evento withdrawal.completed', async () => {
    retiroPrueba.marcarComoCompletado('ACH-123');
    await adaptador.publicarRetiroCompletado(retiroPrueba);
    expect(mockClienteRmq.emit).toHaveBeenCalledWith('withdrawal.completed', expect.objectContaining({
      evento: 'withdrawal.completed',
      id: 'ret-1',
    }));
  });

  it('debe emitir el evento withdrawal.failed', async () => {
    retiroPrueba.marcarComoFallido('Error banco');
    await adaptador.publicarRetiroFallido(retiroPrueba);
    expect(mockClienteRmq.emit).toHaveBeenCalledWith('withdrawal.failed', expect.objectContaining({
      evento: 'withdrawal.failed',
      id: 'ret-1',
    }));
  });
});
