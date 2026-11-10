import { BilleteraUsdHttpAdaptador } from './billetera-usd-http.adaptador';

describe('BilleteraUsdHttpAdaptador', () => {
  const usuarioId = 'd3b07384-d113-46e4-a123-561234567890';
  const walletId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  let fetchMock: jest.SpyInstance;
  const wallet = { id: walletId, user_id: usuarioId, moneda: 'USD' };
  beforeEach(() => {
    process.env.BILLETERA_USD_URL = 'http://billetera.test';
    fetchMock = jest.spyOn(global, 'fetch');
  });
  afterEach(() => { fetchMock.mockRestore(); delete process.env.BILLETERA_USD_URL; });
  const response = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });

  it('consulta el usuario y debita con el UUID de billetera y un monto decimal en texto', async () => {
    fetchMock.mockResolvedValueOnce(response(200, wallet)).mockResolvedValueOnce(response(201, { movimiento_id: 'mov-1', moneda: 'USD' }));
    const resultado = await new BilleteraUsdHttpAdaptador().debitar(usuarioId, 50.5);
    expect(resultado).toEqual({ estado: 'DEBITADO', movimientoId: 'mov-1', billeteraId: walletId });
    expect(String(fetchMock.mock.calls[0][0])).toBe(`http://billetera.test/api/v1/billetera/usuarios/${usuarioId}/wallet`);
    expect(String(fetchMock.mock.calls[1][0])).toBe(`http://billetera.test/api/v1/billetera/wallets/${walletId}/retiros`);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ monto: '50.50' });
  });

  it('no debita cuando la billetera pertenece a otro usuario o moneda', async () => {
    fetchMock.mockResolvedValueOnce(response(200, { ...wallet, moneda: 'PEN' }));
    expect((await new BilleteraUsdHttpAdaptador().debitar(usuarioId, 50)).estado).toBe('NO_DEBITADO');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('clasifica fondos insuficientes como rechazo', async () => {
    fetchMock.mockResolvedValueOnce(response(200, wallet)).mockResolvedValueOnce(response(422, {}));
    expect((await new BilleteraUsdHttpAdaptador().debitar(usuarioId, 50)).estado).toBe('RECHAZADO');
  });

  it('deja incierta una interrupción durante el débito y no lo reintenta', async () => {
    fetchMock.mockResolvedValueOnce(response(200, wallet)).mockRejectedValueOnce(new Error('timeout'));
    expect((await new BilleteraUsdHttpAdaptador().debitar(usuarioId, 50)).estado).toBe('DESCONOCIDO');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('no conecta sin una URL configurada', async () => {
    delete process.env.BILLETERA_USD_URL;
    expect((await new BilleteraUsdHttpAdaptador().debitar(usuarioId, 50)).estado).toBe('NO_DEBITADO');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
