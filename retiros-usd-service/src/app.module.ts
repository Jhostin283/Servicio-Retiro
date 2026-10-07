import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ModuloRetiros } from './infrastructure/modules/modulo-retiros.module';
import { EntidadRetiroORM } from './infrastructure/adapters/persistence/entidad-retiro.orm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'db_servicio_retiros_usd',
      entities: [EntidadRetiroORM],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ModuloRetiros,
  ],
})
export class AppModule {}
