import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('ServicioRetirosBootstrap');

  const app = await NestFactory.create(AppModule);

  // 🌐 Habilitar CORS para permitir peticiones del cliente frontend (Angular :4200)
  app.enableCors();

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 📄 Configuración de Swagger / OpenAPI Spec
  const configSwagger = new DocumentBuilder()
    .setTitle('API de Microservicio de Retiros en Dólares (USD)')
    .setDescription(
      'Especificación OpenAPI 3.0 para el Microservicio de Retiros en Dólares USD. Desarrollado con Arquitectura Hexagonal y Principios SOLID.',
    )
    .setVersion('1.0.0')
    .addTag('Retiros en Dólares (USD)')
    .build();

  const documentoSwagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, documentoSwagger);

  // Configurar transporte RabbitMQ
  const rmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: 'withdrawal_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  logger.log(`📥 Microservicio RabbitMQ escuchando en la cola 'withdrawal_queue'`);

  const port = process.env.PORT || 3004;
  await app.listen(port);
  logger.log(`🚀 API REST de Retiros (HTTP) corriendo en http://localhost:${port}/retiros`);
  logger.log(`📄 Documentación OpenAPI (Swagger UI) disponible en http://localhost:${port}/api/docs`);
}

bootstrap();
