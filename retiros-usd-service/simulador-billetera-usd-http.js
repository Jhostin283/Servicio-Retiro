const http = require('http');
const { randomUUID } = require('crypto');
const usuarios = new Map();
const billeteras = new Map();
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const buscar = url.pathname.match(/^\/api\/v1\/billetera\/usuarios\/([^/]+)\/wallet$/);
  const debitar = url.pathname.match(/^\/api\/v1\/billetera\/wallets\/([^/]+)\/retiros$/);
  const responder = (status, body) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); };
  if (req.method === 'GET' && buscar) {
    const usuario = decodeURIComponent(buscar[1]);
    if (!usuarios.has(usuario)) {
      const wallet = { id: randomUUID(), user_id: usuario, moneda: 'USD', balanceCentavos: 50000 };
      usuarios.set(usuario, wallet); billeteras.set(wallet.id, wallet);
    }
    const wallet = usuarios.get(usuario);
    return responder(200, { id: wallet.id, user_id: wallet.user_id, moneda: 'USD', balance: (wallet.balanceCentavos / 100).toFixed(2) });
  }
  if (req.method === 'POST' && debitar) {
    const wallet = billeteras.get(debitar[1]);
    if (!wallet) return responder(404, { message: 'Billetera no encontrada' });
    let data = '';
    req.on('data', chunk => { data += chunk; });
    return req.on('end', () => {
      let body;
      try { body = JSON.parse(data); } catch { return responder(400, { message: 'JSON inválido' }); }
      if (typeof body.monto !== 'string' || !/^\d+(\.\d{1,2})?$/.test(body.monto)) return responder(400, { message: 'Monto inválido' });
      const centavos = Math.round(Number(body.monto) * 100);
      if (centavos <= 0) return responder(400, { message: 'Monto inválido' });
      if (process.env.SIMULAR_RECHAZO === '1' || centavos > wallet.balanceCentavos) return responder(422, { code: 'FONDOS_INSUFICIENTES' });
      wallet.balanceCentavos -= centavos;
      return responder(201, { movimiento_id: randomUUID(), balance: (wallet.balanceCentavos / 100).toFixed(2), moneda: 'USD' });
    });
  }
  return responder(404, { message: 'Ruta no encontrada' });
});
server.listen(3005, '127.0.0.1', () => console.log('Billetera USD simulada HTTP en http://127.0.0.1:3005 (solo pruebas; saldo inicial USD 500 por usuario).'));
