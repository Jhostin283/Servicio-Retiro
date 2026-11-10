import { Injectable, Logger } from '@nestjs/common';
import { BilleteraUsdPuerto, ResultadoDebito } from '../../../domain/ports/output/billetera-usd.puerto';

@Injectable()
export class BilleteraUsdHttpAdaptador implements BilleteraUsdPuerto {
  private readonly logger = new Logger(BilleteraUsdHttpAdaptador.name);

  async debitar(usuarioId: string, montoUSD: number): Promise<ResultadoDebito> {
    const configurada = process.env.BILLETERA_USD_URL;
    if (!configurada) return { estado: 'NO_DEBITADO', razon: 'Billetera USD no configurada' };

    let base: URL;
    try {
      base = new URL(configurada.endsWith('/') ? configurada : `${configurada}/`);
      if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw new Error('URL inválida');
    } catch {
      return { estado: 'NO_DEBITADO', razon: 'Dirección de billetera USD inválida' };
    }

    let wallet: { id?: unknown; user_id?: unknown; moneda?: unknown };
    try {
      const response = await fetch(new URL(`api/v1/billetera/usuarios/${encodeURIComponent(usuarioId)}/wallet`, base), {
        signal: AbortSignal.timeout(5000), redirect: 'error',
      });
      if (response.status === 404) return { estado: 'RECHAZADO', razon: 'Billetera USD no encontrada' };
      if (!response.ok) return { estado: 'NO_DEBITADO', razon: `No se pudo consultar billetera (HTTP ${response.status})` };
      wallet = await response.json() as typeof wallet;
      if (!wallet || typeof wallet.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(wallet.id) || wallet.moneda !== 'USD' || wallet.user_id !== usuarioId) {
        return { estado: 'NO_DEBITADO', razon: 'Respuesta de billetera inválida o no corresponde al usuario USD' };
      }
    } catch {
      return { estado: 'NO_DEBITADO', razon: 'No se pudo consultar la billetera USD' };
    }

    try {
      const response = await fetch(new URL(`api/v1/billetera/wallets/${wallet.id}/retiros`, base), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monto: montoUSD.toFixed(2) }),
        signal: AbortSignal.timeout(5000), redirect: 'error',
      });
      if (response.status === 422) return { estado: 'RECHAZADO', razon: 'Billetera rechazó el débito por fondos insuficientes' };
      if (response.status === 400 || response.status === 404) return { estado: 'NO_DEBITADO', razon: `Billetera rechazó la solicitud (HTTP ${response.status})` };
      if (response.status !== 201) return { estado: 'DESCONOCIDO', razon: `Resultado del débito incierto (HTTP ${response.status}); requiere revisión manual` };
      const data = await response.json() as { movimiento_id?: unknown; moneda?: unknown };
      if (!data || typeof data.movimiento_id !== 'string' || !data.movimiento_id || data.moneda !== 'USD') {
        return { estado: 'DESCONOCIDO', razon: 'Respuesta de débito incompleta; requiere revisión manual' };
      }
      return { estado: 'DEBITADO', movimientoId: data.movimiento_id, billeteraId: wallet.id as string };
    } catch {
      this.logger.error('No se pudo confirmar la respuesta del débito de billetera; no reintentar automáticamente.');
      return { estado: 'DESCONOCIDO', razon: 'No se pudo confirmar el débito; requiere revisión manual' };
    }
  }
}

