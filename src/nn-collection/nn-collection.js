export class NNCollection {
  constructor() {
    this.props = {
      items: [],
      current: 0
    };
  }
  //
  initialize(props) {
    for (let prop in props) this.props[prop] = props[prop];
    this.show(this.props.current);
    return this;
  }
  //
  set current(n = 0) {
    this.props.current = Math.max(0, Math.min(n, this.items.length - 1));
    this.onChange(this);
  }
  get current() {
    return this.props.current;
  }
  get items() {
    return this.props.items;
  }
  get isFirst() {
    return this.current === 0;
  }
  get isLast() {
    return this.current === this.items.length - 1;
  }
  get firstItem() {
    return this.items[0];
  }
  get lastItem() {
    return this.items[this.items.length - 1];
  }
  //
  random() {
    this.current = Math.floor(Math.random() * this.items.length);
  }
  next() {
    this.current++;
  }
  prev() {
    this.current--;
  }
  show(n = 0) {
    this.current = n;
  }
  //
  onChange(e) {}
}
