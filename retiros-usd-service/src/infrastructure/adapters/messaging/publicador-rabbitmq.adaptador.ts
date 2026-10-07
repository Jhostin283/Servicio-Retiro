import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PublicadorEventosPuerto } from '../../../domain/ports/output/publicador-eventos.puerto';
import { Retiro } from '../../../domain/models/retiro.modelo';

@Injectable()
export class AdaptadorPublicadorRabbitMQ implements PublicadorEventosPuerto {
  private readonly logger = new Logger(AdaptadorPublicadorRabbitMQ.name);

  constructor(
    @Inject('RABBITMQ_SERVICE')
    private readonly clienteRmq: ClientProxy,
  ) {}

  async publicarRetiroSolicitado(retiro: Retiro): Promise<void> {
    const payload = {
      evento: 'withdrawal.requested',
      id: retiro.id,
      usuarioId: retiro.usuarioId,
      montoUSD: retiro.montoUSD.obtenerValor(),
      moneda: retiro.moneda,
      codigoBanco: retiro.codigoBanco,
      cuentaDestino: retiro.cuentaDestino,
      fecha: retiro.fechaCreacion,
    };

    this.logger.log(
      `[RabbitMQ -> Emit] Evento 'withdrawal.requested' para retiro ${retiro.id} ($${payload.montoUSD} USD)`,
    );
    this.clienteRmq.emit('withdrawal.requested', payload);
  }

  async publicarRetiroCompletado(retiro: Retiro): Promise<void> {
    const payload = {
      evento: 'withdrawal.completed',
      id: retiro.id,
      usuarioId: retiro.usuarioId,
      montoUSD: retiro.montoUSD.obtenerValor(),
      referenciaBancaria: retiro.referenciaBancaria,
      fecha: new Date().toISOString(),
    };

    this.logger.log(`[RabbitMQ -> Emit] Evento 'withdrawal.completed' para retiro ${retiro.id}`);
    this.clienteRmq.emit('withdrawal.completed', payload);
  }

  async publicarRetiroFallido(retiro: Retiro): Promise<void> {
    const payload = {
      evento: 'withdrawal.failed',
      id: retiro.id,
      usuarioId: retiro.usuarioId,
      razonFallo: retiro.razonFallo,
      fecha: new Date().toISOString(),
    };

    this.logger.log(`[RabbitMQ -> Emit] Evento 'withdrawal.failed' para retiro ${retiro.id}`);
    this.clienteRmq.emit('withdrawal.failed', payload);
  }
}
