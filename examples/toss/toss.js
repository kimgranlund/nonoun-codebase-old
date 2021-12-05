import "./toss.css";

import { NNDelegate } from "/src/nn-delegate/nn-delegate.js";
import { NNPhysics2D } from "/src/nn-physics-2d/nn-physics-2d.js";
import { NNRender, NNRenderer } from "/src/nn-render/nn-render.js";

(() => {
  //
  //
  const element = NNDelegate.createElement(document.getElementById("ball"));
  const renderer = new NNRender();
  renderer.initialize({
    callback: (e) => {
      const target = {
        x: e.details.target.x - e.details.offset.x,
        y: e.details.target.y - e.details.offset.y
      };
      const position = NNPhysics2D.equation(
        e.details.element.position,
        target,
        1 - e.details.drag
      );
      const delta = NNPhysics2D.delta(target, position);
      const mag = NNPhysics2D.magnitide(delta);
      if (mag < e.details.threshold.distance) {
        e.details.element.position = target;
        e.stop();
      } else {
        e.details.element.position = position;
      }
    },
    details: {
      offset: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      element: element,
      drag: 0.94,
      threshold: {
        time: 1000 / 10,
        distance: 1
      }
    },
    rate: 1000 / 60
  });
  /*
  const renderer_old = NNRender.create(
    (e) => {
      const element = e.details.element;
      //
      const target = {
        x: e.details.target.x - e.details.offset.x,
        y: e.details.target.y - e.details.offset.y
      };
      //
      const position = NNPhysics2D.equation(
        element.position,
        target,
        1 - e.details.drag
      );
      const delta = NNPhysics2D.delta(target, position);
      const mag = NNPhysics2D.magnitide(delta);
      if (mag < e.details.threshold.distance) {
        element.position = target;
        e.stop();
      } else {
        element.position = position;
      }
    },
    {
      offset: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      element: element,
      drag: 0.94,
      threshold: {
        time: 1000 / 10,
        distance: 1
      },
      rate: 1000 / 100
    }
  );
  */
  //
  const pointer = NNDelegate.createPointer(document);
  pointer.onPointerDown = (e) => {
    renderer.details.offset.x = (renderer.details.target.x = e.x) - element.x;
    renderer.details.offset.y = (renderer.details.target.y = e.y) - element.y;
    renderer.start();
  };
  pointer.onPointerDraw = (e) => {
    renderer.details.target.x = e.x;
    renderer.details.target.y = e.y;
    renderer.start();
  };
  pointer.onPointerUp = (e) => {
    //
    // what is the relevant velocity in our time treshold?
    const history = e.filterByTimeAfter(
      e.drawHistory,
      performance.now() - renderer.details.threshold.time
    );
    const velocity = NNPhysics2D.velocity(history);
    //
    // what is our next position, give the velocity?
    renderer.details.target.x += velocity.average.x;
    renderer.details.target.y += velocity.average.y;
  };
  //
  //
})();
