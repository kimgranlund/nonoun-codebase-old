//console.log([] instanceof Array);
//console.log(document.body instanceof HTMLElement);
//

export class NNPhysics2D {
  static position(position) {
    if (position instanceof Array)
      position = { x: position[0], y: position[1] };
    else if (position instanceof HTMLElement)
      position = position.getBoundingClientRect();
    return {
      x: position.x,
      y: position.y,
      time: performance.now()
    };
  }
  static delta(a = { x: 0, y: 0, time: 0 }, b = { x: 0, y: 0, time: 0 }) {
    return {
      x: a.x - b.x || 0,
      y: a.y - b.y || 0,
      v: Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) || 0,
      time: a.time - b.time || 0
    };
  }
  static magnitide(a = { x: 0, y: 0, time: 0 }, b = { x: 0, y: 0, time: 0 }) {
    return Math.sqrt(Math.pow(a.x + b.x, 2) + Math.pow(a.y + b.y, 2));
  }
  static velocity(arr) {
    const current = NNPhysics2D.delta(
      arr[arr.length - 1],
      arr[arr.length - 2] || arr[arr.length - 1]
    );
    const previous = NNPhysics2D.delta(
      arr[arr.length - 2] || arr[arr.length - 1],
      arr[arr.length - 3] || arr[arr.length - 2] || arr[arr.length - 1]
    );
    const average = {
      x: (current.x + previous.x) / 2,
      y: (current.y + previous.y) / 2,
      v:
        Math.sqrt(
          Math.pow(current.x + previous.x, 2) +
            Math.pow(current.y + previous.y, 2)
        ) / 2,
      time: (current.time + previous.time) / 2
    };
    return { current, previous, average };
  }
  static equation(a, b, drag = 0.1) {
    const o = {};
    for (let prop in a) {
      o[prop] = a[prop] + (b[prop] - a[prop]) * drag;
    }
    return o;
  }
}
