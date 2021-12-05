export class NNRender {
  constructor(callback, rate, details) {
    this.id = undefined;
    this.count = -1;
    this.time = {
      initial: null,
      current: null,
      next: null
    };
    this.rate = rate;
    this.details = details;
    this.callback = callback;
  }
  initialize(props) {
    Object.assign(this, props);
    return this;
  }
  get isActive() {
    return this.id !== undefined;
  }
  start() {
    if (!this.isActive) {
      this.time = {
        initial: performance.now(),
        current: performance.now(),
        next: performance.now() - this.rate
      };
      this.render();
    }
  }
  stop() {
    this.id = (window.cancelAnimationFrame || window.mozCancelAnimationFrame)(
      this.id
    );
  }
  render() {
    this.id = (
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      ((callback, rate) => {
        return setTimeout(callback, rate, 0, this);
      })
    )(this.render.bind(this), this.rate);
    this.time.current = performance.now();
    if (this.time.current >= this.time.next) {
      this.time.next = this.time.current + this.rate;
      this.count++;
      try {
        this.callback(this);
      } catch (e) {
        this.stop();
      }
    }
  }
}

export const NNRenderer = new (class {
  constructor() {
    this.items = new Map();
    this.defaults = {
      rate: 1000 / 60
    };
  }
  create(callback, rate = this.defaults.rate, details) {
    const o = new NNRender();
    return o.initialize({
      callback: callback,
      rate: rate,
      details: details
    });
  }
  add(callback, rate = this.defaults.rate, details) {
    if (this.items.has(callback)) this.remove(callback);
    const item = this.create(callback, rate, details);
    this.items.set(callback, item);
    item.render();
  }
  cancel(o) {
    (window.cancelAnimationFrame || window.mozCancelAnimationFrame)(o.id);
  }
  remove(o) {
    try {
      if (this.items.has(o.callback)) {
        this.items.get(o.callback).stop();
        this.items.delete(o.callback);
      } else if (typeof o.callback === "number") {
        this.cancel({ id: o.callback });
      } else if (typeof o.id === "number") {
        this.cancel({ id: o.id });
      }
    } catch (e) {
      console.log("Couldn't remove Animation Frame");
    }
  }
})();
