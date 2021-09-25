export class labHelper {
  private iterations: { t: number; answer: number; n: number }[] = [];
  private iterations3Knot: { t: number; answer: number }[] = [];
  private iterations4Knot: { t: number; answer: number }[] = [];

  private tableVariables = {
    a: -1,
    b: 0,
    c: 0.5,
    d: 1.5,
    m: 15,
    e: 0.001,
  };

  private getTau = () => {
    return +(
      (this.tableVariables.d - this.tableVariables.c) /
      this.tableVariables.m
    ).toFixed(5);
  };

  private getG = (t: number, x: number) => {
    return +(
      +Math.cos(t + x ** 2 + 0.5).toFixed(5) /
      (2 + +Math.sin(x ** 2 + 1).toFixed(5))
    ).toFixed(5);
  };

  private getHq = () => {
    const hq = +((this.tableVariables.b - this.tableVariables.a) / 2).toFixed(
      5
    );
    const hqq = +((this.tableVariables.b + this.tableVariables.a) / 2).toFixed(
      5
    );
    return { hq, hqq };
  };

  public roundM = () => {
    const tau = +this.getTau();
    for (let j = 0; j <= this.tableVariables.m; j++) {
      const t = +(this.tableVariables.c + j * tau).toFixed(5);
      this.simpson(t);
      this.method3Knot(t);
      this.method4Knot(t);
    }
    return {
      simpson: this.iterations,
      knotThread: this.iterations3Knot,
      knotFourier: this.iterations4Knot,
    };
  };

  private method3Knot = (t: number) => {
    const { hq, hqq } = this.getHq();
    const tmp_3b =
      +((5 * hq) / 9).toFixed(5) * this.getG(t, hq * -Math.sqrt(3 / 5)) +
      +((8 * hq) / 9).toFixed(5) * this.getG(t, hqq) +
      +((5 * hq) / 9).toFixed(5) * this.getG(t, hq * -Math.sqrt(3 / 5) + hqq);
    this.iterations3Knot.push({ t, answer: +tmp_3b.toFixed(5) });
  };

  private method4Knot = (t: number) => {
    const { hq, hqq } = this.getHq();
    const tmp_4b =
      hq * 0.347855 * this.getG(t, hq * -0.861136 + hqq) +
      hq * 0.652145 * this.getG(t, hq * -0.339981 + hqq) +
      hq * 0.652145 * this.getG(t, hq * 0.339981 + hqq) +
      hq * 0.347855 * this.getG(t, hq * 0.861136 + hqq);
    this.iterations4Knot.push({ t, answer: +tmp_4b.toFixed(5) });
  };

  private simpson = (t: number) => {
    let stopRound = false;
    let step = 2;
    let prevSum = 0;
    while (!stopRound) {
      const h = +(
        (this.tableVariables.b - this.tableVariables.a) /
        (2 * step)
      ).toFixed(5);
      let sum = 0;
      let evenSum = 0;
      let notEvenSum = 0;
      for (let i = 1; i <= step * 2 - 1; i++) {
        let g = this.getG(t, this.tableVariables.a + i * h);
        if (i % 2 === 0) {
          evenSum += g;
        } else {
          notEvenSum += g;
        }
      }
      const gA = this.getG(t, this.tableVariables.a);
      const gB = this.getG(t, this.tableVariables.b);
      sum = +((gA + gB + evenSum * 2 + notEvenSum * 4) * (h / 3)).toFixed(5);
      if (Math.abs(sum - prevSum) < this.tableVariables.e) {
        stopRound = true;
        this.iterations.push({ t, answer: sum, n: step });
        // return;
      } else {
        prevSum = sum;
        step *= 2;
      }
    }
  };
}
