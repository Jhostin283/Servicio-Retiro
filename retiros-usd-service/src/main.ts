import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { crearDocumentoOpenApi } from './openapi';

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

  // Configuracion de Swagger / OpenAPI Spec
  const documentoSwagger = crearDocumentoOpenApi(app);
  SwaggerModule.setup('api/docs', app, documentoSwagger);

  const port = process.env.PORT || 3004;
  await app.listen(port);
  logger.log(`🚀 API REST de Retiros (HTTP) corriendo en http://localhost:${port}/api/v1/retiros`);
  logger.log(`📄 Documentación OpenAPI (Swagger UI) disponible en http://localhost:${port}/api/docs`);
}

bootstrap();
