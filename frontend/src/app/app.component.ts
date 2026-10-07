import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RetirosService } from './services/retiros.service';
import { RetiroResponse } from './models/retiro.interface';

export interface BancoItem {
  codigo: string;
  nombre: string;
  desc: string;
}

export interface TipoCuentaItem {
  codigo: string;
  nombre: string;
  sub: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  formRetiro!: FormGroup;
  cargando: boolean = false;
  respuestaServer: any = null;
  statusHttp: number | null = null;
  historial: RetiroResponse[] = [];
  mensajeToast: string | null = null;
  tipoToast: 'success' | 'danger' | 'warning' | 'info' = 'info';

  vistaSubRuta: 'solicitud' | 'historial_detallado' = 'solicitud';
  filtroEstadoHistorial: string = 'TODOS';
  busquedaHistorial: string = '';
  retiroSeleccionadoModal: RetiroResponse | null = null;

  bancoDropdownAbierto: boolean = false;
  tipoCuentaDropdownAbierto: boolean = false;
  perfilDropdownAbierto: boolean = false;

  readonly usuarioIdDefault = 'd3b07384-d113-46e4-a123-561234567890';
  readonly nombreUsuario = 'Carlos Eduardo Mendoza';
  readonly tipoUsuario = 'Cliente Verificado USD (Nivel 3)';
  readonly tasaCambioPEN = 3.75; // 1 USD = 3.75 PEN

  readonly bancos: BancoItem[] = [
    { codigo: 'CHASEUS33XXX', nombre: 'JPMorgan Chase Bank', desc: 'Transferencia ACH / Wire Directa' },
    { codigo: 'WFBIUS6SXXX', nombre: 'Wells Fargo Bank N.A.', desc: 'Cuenta Principal Bancaria' },
    { codigo: 'BOFAUS3NXXX', nombre: 'Bank of America', desc: 'Red Bancaria Internacional' },
    { codigo: 'CITIUS33XXX', nombre: 'Citibank N.A.', desc: 'Transferencia Directa' },
  ];

  readonly tiposCuenta: TipoCuentaItem[] = [
    { codigo: 'AHORROS', nombre: 'Cuenta de Ahorros', sub: 'Savings Account' },
    { codigo: 'CORRIENTE', nombre: 'Cuenta Corriente', sub: 'Checking Account' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly retirosService: RetirosService,
  ) {}

  ngOnInit(): void {
    this.formRetiro = this.fb.group({
      usuarioId: [this.usuarioIdDefault, [Validators.required]],
      montoUSD: [150.50, [Validators.required, Validators.min(1.00), Validators.max(10000.00)]],
      codigoBanco: ['CHASEUS33XXX', [Validators.required]],
      cuentaDestino: ['987654321012', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      tipoCuenta: ['AHORROS', [Validators.required]],
      monedaDestino: ['USD', [Validators.required]],
    });

    this.consultarHistorial();
  }

  get montoControl() { return this.formRetiro.get('montoUSD'); }
  get cuentaControl() { return this.formRetiro.get('cuentaDestino'); }
  get bancoControl() { return this.formRetiro.get('codigoBanco'); }
  get monedaDestinoControl() { return this.formRetiro.get('monedaDestino'); }

  get esMonedaPEN(): boolean {
    return this.formRetiro.get('monedaDestino')?.value === 'PEN';
  }

  get montoEnSoles(): number {
    const usd = Number(this.montoControl?.value) || 0;
    return Math.round((usd * this.tasaCambioPEN) * 100) / 100;
  }

  get bancoSeleccionado(): BancoItem {
    const cod = this.formRetiro.get('codigoBanco')?.value;
    return this.bancos.find(b => b.codigo === cod) || this.bancos[0];
  }

  get tipoCuentaSeleccionado(): TipoCuentaItem {
    const cod = this.formRetiro.get('tipoCuenta')?.value;
    return this.tiposCuenta.find(t => t.codigo === cod) || this.tiposCuenta[0];
  }

  get historialFiltrado(): RetiroResponse[] {
    return this.historial.filter(r => {
      const coincideEstado = this.filtroEstadoHistorial === 'TODOS' || r.estado === this.filtroEstadoHistorial;
      const busq = this.busquedaHistorial.toLowerCase().trim();
      const coincideBusqueda = !busq || 
        r.codigoBanco.toLowerCase().includes(busq) ||
        r.cuentaDestino.toLowerCase().includes(busq) ||
        (r.referenciaBancaria && r.referenciaBancaria.toLowerCase().includes(busq)) ||
        r.id.toLowerCase().includes(busq);

      return coincideEstado && coincideBusqueda;
    });
  }

  cambiarSubRuta(ruta: 'solicitud' | 'historial_detallado'): void {
    this.vistaSubRuta = ruta;
    if (ruta === 'historial_detallado') {
      this.consultarHistorial();
    }
  }

  abrirDetalleRetiro(r: RetiroResponse): void {
    this.retiroSeleccionadoModal = r;
  }

  cerrarDetalleRetiro(): void {
    this.retiroSeleccionadoModal = null;
  }

  togglePerfilDropdown(): void {
    this.perfilDropdownAbierto = !this.perfilDropdownAbierto;
    this.bancoDropdownAbierto = false;
    this.tipoCuentaDropdownAbierto = false;
  }

  cambiarMonedaDestino(moneda: 'USD' | 'PEN'): void {
    this.formRetiro.patchValue({ monedaDestino: moneda });
    if (moneda === 'PEN') {
      this.mostrarNotificacion(`Retiro convertido a Soles (S/ PEN). Tasa de cambio: S/ ${this.tasaCambioPEN} por $1 USD`, 'info');
    } else {
      this.mostrarNotificacion('Retiro configurado para cobro directo en Dólares ($USD)', 'info');
    }
  }

  toggleBancoDropdown(): void {
    this.bancoDropdownAbierto = !this.bancoDropdownAbierto;
    this.tipoCuentaDropdownAbierto = false;
    this.perfilDropdownAbierto = false;
  }

  seleccionarBanco(banco: BancoItem): void {
    this.formRetiro.patchValue({ codigoBanco: banco.codigo });
    this.bancoDropdownAbierto = false;
  }

  toggleTipoCuentaDropdown(): void {
    this.tipoCuentaDropdownAbierto = !this.tipoCuentaDropdownAbierto;
    this.bancoDropdownAbierto = false;
    this.perfilDropdownAbierto = false;
  }

  seleccionarTipoCuenta(tipo: TipoCuentaItem): void {
    this.formRetiro.patchValue({ tipoCuenta: tipo.codigo });
    this.tipoCuentaDropdownAbierto = false;
  }

  ajustarMonto(delta: number): void {
    const actual = Number(this.formRetiro.get('montoUSD')?.value) || 0;
    const nuevo = Math.min(10000, Math.max(1, Math.round((actual + delta) * 100) / 100));
    this.formRetiro.patchValue({ montoUSD: nuevo });
  }

  fijarMonto(monto: number): void {
    this.formRetiro.patchValue({ montoUSD: monto });
  }

  onRangeChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.formRetiro.patchValue({ montoUSD: val });
  }

  cargarPreset(tipo: 'exito' | 'fallo_banco' | 'monto_invalido'): void {
    if (tipo === 'exito') {
      this.formRetiro.patchValue({
        usuarioId: this.usuarioIdDefault,
        montoUSD: 150.50,
        codigoBanco: 'CHASEUS33XXX',
        cuentaDestino: '987654321012',
        tipoCuenta: 'AHORROS',
        monedaDestino: 'USD',
      });
      this.formRetiro.markAllAsTouched();
      this.mostrarNotificacion('Solicitud configurada: $150.50 USD (Chase Bank)', 'info');
    } else if (tipo === 'fallo_banco') {
      this.formRetiro.patchValue({
        usuarioId: this.usuarioIdDefault,
        montoUSD: 50.00,
        codigoBanco: 'WFBIUS6SXXX',
        cuentaDestino: '0000',
        tipoCuenta: 'CORRIENTE',
        monedaDestino: 'USD',
      });
      this.formRetiro.markAllAsTouched();
      this.mostrarNotificacion('Caso de prueba: Rechazo por cuenta inactiva (Cuenta: 0000)', 'warning');
    } else if (tipo === 'monto_invalido') {
      this.formRetiro.patchValue({
        usuarioId: this.usuarioIdDefault,
        montoUSD: 0.50,
        codigoBanco: 'CHASEUS33XXX',
        cuentaDestino: '987654321012',
        monedaDestino: 'USD',
      });
      this.formRetiro.markAllAsTouched();
      this.mostrarNotificacion('Caso de prueba: Monto menor al mínimo permitido ($1.00 USD)', 'danger');
    }
  }

  enviarSolicitud(): void {
    this.formRetiro.markAllAsTouched();

    if (this.formRetiro.invalid) {
      this.mostrarNotificacion('El formulario contiene errores de validación. Por favor revísalos.', 'danger');
      return;
    }

    this.cargando = true;
    const { usuarioId, montoUSD, codigoBanco, cuentaDestino, tipoCuenta } = this.formRetiro.value;

    this.retirosService.crearSolicitud({ usuarioId, montoUSD, codigoBanco, cuentaDestino, tipoCuenta }).subscribe({
      next: (res) => {
        this.cargando = false;
        this.statusHttp = 202;
        this.respuestaServer = res;
        this.mostrarNotificacion('¡Solicitud de retiro procesada correctamente!', 'success');
        setTimeout(() => this.consultarHistorial(), 800);
      },
      error: (err) => {
        this.cargando = false;
        this.statusHttp = err.status || 400;
        this.respuestaServer = err.error || err;
        this.mostrarNotificacion('Error en el procesamiento de la solicitud.', 'danger');
      },
    });
  }

  consultarHistorial(): void {
    const usuarioId = this.formRetiro.get('usuarioId')?.value || this.usuarioIdDefault;
    this.retirosService.obtenerPorUsuarioId(usuarioId).subscribe({
      next: (data) => {
        this.historial = data;
      },
      error: () => {
        this.historial = [];
      },
    });
  }

  notificarModuloNoImplementado(nombreModulo: string): void {
    this.perfilDropdownAbierto = false;
    this.mostrarNotificacion(`El módulo '${nombreModulo}' aún no se encuentra implementado. El servicio de Retiros USD está 100% activo.`, 'warning');
  }

  notificarServicioNoDisponible(nombreServicio: string): void {
    this.mostrarNotificacion(`El ${nombreServicio} forma parte de un microservicio futuro y estará disponible en el siguiente sprint.`, 'info');
  }

  mostrarNotificacion(msg: string, tipo: 'success' | 'danger' | 'warning' | 'info'): void {
    this.mensajeToast = msg;
    this.tipoToast = tipo;
    setTimeout(() => {
      this.mensajeToast = null;
    }, 3500);
  }
}
