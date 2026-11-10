import { createServer, Server } from 'http';
import { AddressInfo } from 'net';
import { BilleteraUsdHttpAdaptador } from './billetera-usd-http.adaptador';

describe('Contrato HTTP de billetera USD', () => {
  let server: Server;
  const usuarioId = 'mariaperez';
  const walletId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  const movimientoId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
  const solicitudes: { metodo: string; ruta: string; cuerpo: string }[] = [];
  beforeAll(async () => {
    server = createServer((req, res) => {
      let cuerpo = '';
      req.on('data', data => { cuerpo += data; });
      req.on('end', () => {
        solicitudes.push({ metodo: req.method!, ruta: req.url!, cuerpo });
        res.setHeader('content-type', 'application/json');
        if (req.method === 'GET') {
          res.end(JSON.stringify({ id: walletId, user_id: usuarioId, moneda: 'USD', balance: '500.00' }));
        } else {
          res.writeHead(201);
          res.end(JSON.stringify({ movimiento_id: movimientoId, balance: '449.50', moneda: 'USD' }));
        }
      });
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    process.env.BILLETERA_USD_URL = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });
  afterAll(async () => {
    delete process.env.BILLETERA_USD_URL;
    await new Promise<void>((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
  });
  it('consulta y debita usando HTTP y los nombres del contrato de billetera', async () => {
    const resultado = await new BilleteraUsdHttpAdaptador().debitar(usuarioId, 50.5);
    expect(resultado).toEqual({ estado: 'DEBITADO', billeteraId: walletId, movimientoId });
    expect(solicitudes).toEqual([
      { metodo: 'GET', ruta: `/api/v1/billetera/usuarios/${usuarioId}/wallet`, cuerpo: '' },
      { metodo: 'POST', ruta: `/api/v1/billetera/wallets/${walletId}/retiros`, cuerpo: '{"monto":"50.50"}' },
    ]);
  });
});
