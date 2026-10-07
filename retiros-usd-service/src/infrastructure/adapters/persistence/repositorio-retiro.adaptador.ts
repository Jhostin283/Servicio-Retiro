import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositorioRetiroPuerto } from '../../../domain/ports/output/repositorio-retiro.puerto';
import { Retiro } from '../../../domain/models/retiro.modelo';
import { MontoUSD } from '../../../domain/value-objects/monto-usd.vo';
import { EntidadRetiroORM } from './entidad-retiro.orm';

@Injectable()
export class RepositorioRetiroAdaptador implements RepositorioRetiroPuerto {
  constructor(
    @InjectRepository(EntidadRetiroORM)
    private readonly repoOrm: Repository<EntidadRetiroORM>,
  ) {}

  async guardar(retiro: Retiro): Promise<Retiro> {
    const entidad = this.mapearAOrm(retiro);
    const guardada = await this.repoOrm.save(entidad);
    return this.mapearADominio(guardada);
  }

  async buscarPorId(id: string): Promise<Retiro | null> {
    const encontrada = await this.repoOrm.findOne({ where: { id } });
    if (!encontrada) return null;
    return this.mapearADominio(encontrada);
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<Retiro[]> {
    const encontradas = await this.repoOrm.find({
      where: { usuarioId },
      order: { fechaCreacion: 'DESC' },
    });
    return encontradas.map((e) => this.mapearADominio(e));
  }

  async actualizar(retiro: Retiro): Promise<Retiro> {
    const entidad = this.mapearAOrm(retiro);
    const actualizada = await this.repoOrm.save(entidad);
    return this.mapearADominio(actualizada);
  }

  private mapearAOrm(r: Retiro): EntidadRetiroORM {
    const e = new EntidadRetiroORM();
    e.id = r.id;
    e.usuarioId = r.usuarioId;
    e.montoUSD = r.montoUSD.obtenerValor();
    e.moneda = r.moneda;
    e.codigoBanco = r.codigoBanco;
    e.cuentaDestino = r.cuentaDestino;
    e.tipoCuenta = r.tipoCuenta;
    e.estado = r.estado;
    e.referenciaBancaria = r.referenciaBancaria;
    e.razonFallo = r.razonFallo;
    return e;
  }

  private mapearADominio(e: EntidadRetiroORM): Retiro {
    const montoVO = MontoUSD.crear(Number(e.montoUSD));
    const r = new Retiro(
      e.id,
      e.usuarioId,
      montoVO,
      e.moneda,
      e.codigoBanco,
      e.cuentaDestino,
      e.tipoCuenta,
      e.estado,
      e.referenciaBancaria,
      e.razonFallo,
      e.fechaCreacion ? e.fechaCreacion.toISOString() : new Date().toISOString(),
    );
    return r;
  }
}
