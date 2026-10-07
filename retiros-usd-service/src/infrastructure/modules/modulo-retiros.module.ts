import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EntidadRetiroORM } from '../adapters/persistence/entidad-retiro.orm';
import { RepositorioRetiroAdaptador } from '../adapters/persistence/repositorio-retiro.adaptador';
import { AdaptadorPublicadorRabbitMQ } from '../adapters/messaging/publicador-rabbitmq.adaptador';
import { AdaptadorPasarelaBancaria } from '../adapters/bank/pasarela-bancaria.adaptador';
import { RetiroHttpControlador } from '../controllers/retiro-http.controlador';
import { RetiroEventosControlador } from '../controllers/retiro-eventos.controlador';
import { CrearRetiroCasoUso } from '../../application/use-cases/crear-retiro.caso-uso';
import { ConsultarRetiroCasoUso } from '../../application/use-cases/consultar-retiro.caso-uso';
import { ProcesarFondosReservadosCasoUso } from '../../application/use-cases/procesar-fondos-reservados.caso-uso';
import { ProcesarFondosRechazadosCasoUso } from '../../application/use-cases/procesar-fondos-rechazados.caso-uso';
import { REPOSITO_RETIRO_PUERTO } from '../../domain/ports/output/repositorio-retiro.puerto';
import { PUBLICADOR_EVENTOS_PUERTO } from '../../domain/ports/output/publicador-eventos.puerto';
import { PASARELA_BANCARIA_PUERTO } from '../../domain/ports/output/pasarela-bancaria.puerto';

@Module({
  imports: [
    TypeOrmModule.forFeature([EntidadRetiroORM]),
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
            queue: 'wallet_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [RetiroHttpControlador, RetiroEventosControlador],
  providers: [
    CrearRetiroCasoUso,
    ConsultarRetiroCasoUso,
    ProcesarFondosReservadosCasoUso,
    ProcesarFondosRechazadosCasoUso,
    {
      provide: REPOSITO_RETIRO_PUERTO,
      useClass: RepositorioRetiroAdaptador,
    },
    {
      provide: PUBLICADOR_EVENTOS_PUERTO,
      useClass: AdaptadorPublicadorRabbitMQ,
    },
    {
      provide: PASARELA_BANCARIA_PUERTO,
      useClass: AdaptadorPasarelaBancaria,
    },
  ],
  exports: [
    CrearRetiroCasoUso,
    ConsultarRetiroCasoUso,
    ProcesarFondosReservadosCasoUso,
    ProcesarFondosRechazadosCasoUso,
  ],
})
export class ModuloRetiros {}
