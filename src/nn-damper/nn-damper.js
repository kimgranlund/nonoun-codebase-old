export class NNDamper {
  static equation(a, b, d) {
    return a + (b - a) * d;
  }
  constructor(target = 0, drag = 0.05, tolerance = 0.1, rate = 1000 / 60) {
    this.values = [0, 0, 0]; // 0: target, 1: current
    this.settings = {
      drag: drag,
      tolerance: tolerance,
      rate: rate,
      id: undefined,
      time: 0,
      callback: this.update.bind(this)
    };
    this.target = target;
  }
  initialize(settings) {
    for (let prop in settings) this.settings[prop] = settings[prop];
    return this;
  }
  set target(n) {
    this.values[0] = this.values[1] = n;
    if (this.settings.id === undefined) this.update();
    return n;
  }
  get target() {
    return this.values[1];
  }
  get current() {
    return this.values[2];
  }
  update() {
    const { drag, rate, time, callback } = this.settings;
    //
    this.settings.id = (
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      ((callback, rate) => {
        return setTimeout(callback, rate);
      })
    )(callback, rate);
    const time_current = performance.now();
    if (time_current >= time + rate) {
      const v = this.values;
      this.settings.time = time_current;
      try {
        v[1] += ((0 - v[1]) * drag) / 2;
        v[2] += ((v[1] - v[2]) * drag) / 1;

        const delta_t = Math.abs(0 - v[1]);
        const delta_c = Math.abs(v[1] - v[2]);
        if (
          delta_t < this.settings.tolerance &&
          delta_c < this.settings.tolerance
        ) {
          throw this.settings;
        }
        this.onUpdate(this);
      } catch (e) {
        this.settings.id = (
          window.cancelAnimationFrame || window.mozCancelAnimationFrame
        )(e.id);
        this.values = [0, 0, 0];
      }
    }
  }
  onUpdate(e) {}
}
