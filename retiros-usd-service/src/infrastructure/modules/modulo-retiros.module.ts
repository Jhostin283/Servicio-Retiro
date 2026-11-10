import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntidadRetiroORM } from '../adapters/persistence/entidad-retiro.orm';
import { RepositorioRetiroAdaptador } from '../adapters/persistence/repositorio-retiro.adaptador';
import { AdaptadorPasarelaBancaria } from '../adapters/bank/pasarela-bancaria.adaptador';
import { RetiroHttpControlador } from '../controllers/retiro-http.controlador';
import { CrearRetiroCasoUso } from '../../application/use-cases/crear-retiro.caso-uso';
import { ConsultarRetiroCasoUso } from '../../application/use-cases/consultar-retiro.caso-uso';
import { REPOSITO_RETIRO_PUERTO } from '../../domain/ports/output/repositorio-retiro.puerto';
import { BILLETERA_USD_PUERTO } from '../../domain/ports/output/billetera-usd.puerto';
import { BilleteraUsdHttpAdaptador } from '../adapters/wallet/billetera-usd-http.adaptador';
import { PASARELA_BANCARIA_PUERTO } from '../../domain/ports/output/pasarela-bancaria.puerto';

@Module({
  imports: [
    TypeOrmModule.forFeature([EntidadRetiroORM]),
  ],
  controllers: [RetiroHttpControlador],
  providers: [
    CrearRetiroCasoUso,
    ConsultarRetiroCasoUso,
    {
      provide: REPOSITO_RETIRO_PUERTO,
      useClass: RepositorioRetiroAdaptador,
    },
    {
      provide: BILLETERA_USD_PUERTO,
      useClass: BilleteraUsdHttpAdaptador,
    },
    {
      provide: PASARELA_BANCARIA_PUERTO,
      useClass: AdaptadorPasarelaBancaria,
    },
  ],
  exports: [
    CrearRetiroCasoUso,
    ConsultarRetiroCasoUso,
  ],
})
export class ModuloRetiros {}
