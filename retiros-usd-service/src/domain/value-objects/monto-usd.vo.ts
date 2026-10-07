import { BadRequestException } from '@nestjs/common';

export class MontoUSD {
  private readonly valor: number;

  private constructor(valor: number) {
    this.valor = valor;
  }

  public static crear(valor: number): MontoUSD {
    if (valor === undefined || valor === null || isNaN(valor)) {
      throw new BadRequestException('El monto en USD es obligatorio.');
    }
    if (valor < 1.0) {
      throw new BadRequestException('El monto mínimo de retiro es de $1.00 USD.');
    }
    if (valor > 10000.0) {
      throw new BadRequestException('El monto máximo de retiro permitido es de $10,000.00 USD.');
    }
    return new MontoUSD(Number(valor.toFixed(2)));
  }

  public obtenerValor(): number {
    return this.valor;
  }
}
