import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProcesarFondosReservadosCasoUso } from '../../application/use-cases/procesar-fondos-reservados.caso-uso';
import { ProcesarFondosRechazadosCasoUso } from '../../application/use-cases/procesar-fondos-rechazados.caso-uso';

@Controller()
export class RetiroEventosControlador {
  private readonly logger = new Logger(RetiroEventosControlador.name);

  constructor(
    private readonly procesarFondosReservadosCasoUso: ProcesarFondosReservadosCasoUso,
    private readonly procesarFondosRechazadosCasoUso: ProcesarFondosRechazadosCasoUso,
  ) {}

  @EventPattern('withdrawal.funds_reserved')
  async manejarFondosReservados(@Payload() data: { id: string }): Promise<void> {
    this.logger.log(`[RabbitMQ -> Recibido] Evento 'withdrawal.funds_reserved' para retiro ${data.id}`);
    await this.procesarFondosReservadosCasoUso.ejecutar(data.id);
  }

  @EventPattern('withdrawal.funds_rejected')
  async manejarFondosRechazados(@Payload() data: { id: string; razon: string }): Promise<void> {
    this.logger.warn(
      `[RabbitMQ -> Recibido] Evento 'withdrawal.funds_rejected' para retiro ${data.id}. Razón: ${data.razon}`,
    );
    await this.procesarFondosRechazadosCasoUso.ejecutar(data.id, data.razon);
  }
}
