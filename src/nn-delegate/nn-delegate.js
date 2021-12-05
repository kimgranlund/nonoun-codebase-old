export class NNDelegate {
  static createScroll(elem) {
    const o = {
      element: elem,
      history: [{ x: 0, y: 0, time: performance.now() }],
      handleScroll: (e) => {
        o.history.push({
          x: e.target.scrollingElement.scrollLeft,
          y: e.target.scrollingElement.scrollTop,
          width: e.target.scrollingElement.scrollWidth,
          height: e.target.scrollingElement.scrollHeight,
          time: e.target.timeStamp
        });
        o.onScroll(o);
      },
      start: () => {
        o.element.addEventListener("scroll", o.handleScroll);
      },
      stop: () => {
        o.element.removeEventListener("scroll", o.handleScroll);
      }
    };
    o.start();
    return o;
  }
  static createElement(elem) {
    const o = {
      element: elem,
      capture: () => {
        let transform = o.transform;
        return {
          x: transform.e,
          y: transform.f,
          time: performance.now()
        };
      },
      history: [],
      get transform() {
        return new window.WebKitCSSMatrix(
          window.getComputedStyle(o.element, null).getPropertyValue("transform")
        );
      },
      set transform(transform) {
        o.element.style.setProperty("transform", transform);
        o.history.push(o.capture(o.element));
      },
      get position() {
        return {
          x: o.transform.e,
          y: o.transform.f
        };
      },
      set position(position) {
        const transform = o.transform;
        transform.e = position.x;
        transform.f = position.y;
        o.transform = transform;
      },
      get x() {
        return o.transform.e;
      },
      set x(x) {
        const transform = o.transform;
        transform.e = x;
        o.transform = transform;
      },
      get y() {
        return o.transform.f;
      },
      set y(y) {
        const transform = o.transform;
        transform.f = y;
        o.transform = transform;
      },
      get width() {
        return o.element.getBoundingClientRect().width;
      },
      get height() {
        return o.element.getBoundingClientRect().height;
      },
      get rect() {
        return o.element.getBoundingClientRect();
      },
      get firstPosition() {
        return o.history[0];
      },
      get lastPosition() {
        return o.history[o.history.length - 1];
      }
    };
    o.history = [o.capture()];
    return o;
  }
  static createPointer(elem) {
    const o = {
      element: elem,
      types: {
        MOVE: "move",
        DRAW: "draw",
        UP: "up",
        DOWN: "down"
      },
      history: [],
      threshold: 1000 / 30,
      capture(e, type = o.types.MOVE) {
        e = e.changedTouches ? e.changedTouches[0] : e;
        return {
          x: e.clientX,
          y: e.clientY,
          time: performance.now(),
          type: type
        };
      },
      handlers: {
        pointerMove(e) {
          const currentPosition = o.capture(e, o.types.MOVE);
          o.history.push(currentPosition);
          o.onPointerMove(o);
        },
        pointerDraw(e) {
          const current = o.capture(e, o.types.DRAW);
          const history = o.filterByType(o.history, o.types.DRAW);
          const previous =
            history.length > 0
              ? history[history.length - 1]
              : o.filterByType(o.history, o.types.DOWN).pop();
          const delta = current.time - previous.time;
          if (delta >= o.threshold) {
            o.history.push(current);
            o.onPointerDraw(o);
          }
        },
        pointerDown(e) {
          o.element.removeEventListener("pointerdown", o.handlers.pointerDown);
          o.element.addEventListener("pointerup", o.handlers.pointerUp);
          o.element.addEventListener("pointermove", o.handlers.pointerDraw);
          o.history = [o.capture(e, o.types.DOWN)];
          o.onPointerDown(o);
        },
        pointerUp(e) {
          o.element.removeEventListener("pointerup", o.handlers.pointerUp);
          o.element.removeEventListener("pointermove", o.handlers.pointerDraw);
          o.element.addEventListener("pointerdown", o.handlers.pointerDown);
          o.history.push(o.capture(e, o.types.UP));
          o.onPointerUp(o);
        }
      },
      filterByType(list, type = o.types.MOVE) {
        return list.filter((item) => item.type === type);
      },
      filterByTimeAfter(list, time = performance.now() - 500) {
        return list.filter((item) => item.time > time);
      },
      get drawHistory() {
        return o.history.filter((item) => item.type === o.types.DRAW);
      },
      get moveHistory() {
        return o.history.filter((item) => item.type === o.types.MOVE);
      },
      get firstPosition() {
        return o.history[0];
      },
      get lastPosition() {
        return o.history[o.history.length - 1];
      },
      get lastMovePosition() {
        return o.moveHistory.pop();
      },
      get lastDrawPosition() {
        return o.drawHistory.pop();
      },
      get x() {
        return o.lastPosition.x;
      },
      get y() {
        return o.lastPosition.y;
      },
      start() {
        o.element.removeEventListener("pointerup", o.handlers.pointerUp);
        o.element.removeEventListener("pointermove", o.handlers.pointerDraw);
        o.element.addEventListener("pointermove", o.handlers.pointerMove);
        o.element.addEventListener("pointerdown", o.handlers.pointerDown);
      },
      stop() {
        o.element.removeEventListener("pointerdown", o.handlers.pointerDown);
        o.element.removeEventListener("pointerup", o.handlers.pointerUp);
        o.element.removeEventListener("pointermove", o.handlers.pointerMove);
        o.element.removeEventListener("pointermove", o.handlers.pointerDraw);
      },
      onPointerDown: () => {},
      onPointerUp: () => {},
      onPointerMove: () => {},
      onPointerDraw: () => {}
    };
    o.start();
    return o;
  }
}
