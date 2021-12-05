export class NNScrollIntertia {
  static equation(a, b, d) {
    return a + (b - a) * d;
  }
  constructor(target = 0, drag = 0.1, tolerance = 0.1, rate = 1000 / 60) {
    this.values = [0]; // 0: target, 1: current
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
    this.values[0] = n;
    if (this.settings.id === undefined) this.update();
    return n;
  }
  get target() {
    return this.values[0];
  }
  update_old() {
    const { drag, rate, callback } = this.settings;
    const v = this.values;
    //
    if (this.settings.id === undefined)
      this.settings.id = setInterval(callback, rate);

    v[0] += (0 - v[0]) * drag;

    const delta_t = Math.abs(0 - v[0]);
    if (delta_t < this.settings.tolerance) {
      this.settings.id = clearInterval(this.settings.id);
      this.values = [0];
    }
    this.onUpdate(this);
  }
  get current() {
    return this.values[0];
  }
  update() {
    const { drag, rate, callback, time } = this.settings;
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
        v[0] += (0 - v[0]) * drag;
        const delta_t = Math.abs(0 - v[0]);
        if (delta_t < this.settings.tolerance) {
          throw this.settings;
        }
        this.onUpdate(this);
      } catch (e) {
        this.settings.id = (
          window.cancelAnimationFrame || window.mozCancelAnimationFrame
        )(e.id);
        this.values = [0];
      }
    }
  }
  onUpdate(e) {}
}
