import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { EstadoRetiro } from '../../../domain/enums/estado-retiro.enum';

@Entity('retiros')
export class EntidadRetiroORM {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'usuario_id', type: 'varchar', length: 100 })
  @Index('idx_retiros_usuario_id')
  usuarioId!: string;

  @Column({ name: 'monto_usd', type: 'decimal', precision: 12, scale: 2 })
  montoUSD!: number;

  @Column({ name: 'moneda', type: 'varchar', length: 10, default: 'USD' })
  moneda!: string;

  @Column({ name: 'codigo_banco', type: 'varchar', length: 50 })
  codigoBanco!: string;

  @Column({ name: 'cuenta_destino', type: 'varchar', length: 100 })
  cuentaDestino!: string;

  @Column({ name: 'tipo_cuenta', type: 'varchar', length: 50, default: 'AHORROS' })
  tipoCuenta!: string;

  @Column({ name: 'estado', type: 'enum', enum: EstadoRetiro, default: EstadoRetiro.PENDIENTE })
  @Index('idx_retiros_estado')
  estado!: EstadoRetiro;

  @Column({ name: 'referencia_bancaria', type: 'varchar', length: 100, nullable: true })
  referenciaBancaria?: string;

  @Column({ name: 'razon_fallo', type: 'varchar', length: 255, nullable: true })
  razonFallo?: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion!: Date;
}
