import "./gradients.css";

import { NNData } from "/src/nn-utils/nn-utils.js";
import { NNDelegate } from "/src/nn-delegate/nn-delegate.js";
import { NNPhysics2D } from "/src/nn-physics-2d/nn-physics-2d.js";
import { NNRenderer } from "/src/nn-render/nn-render.js";

(() => {
  let palettes, gradients;
  //
  const initialize = (settings) => {
    palettes = settings.palettes;
    gradients = [randomRadialGradient()];
    renderer.start();
  };
  //
  const randomPalette = (palettes) => {
    return palettes[Math.round(Math.random() * palettes.length)];
  };
  const randomColor = (palette) => {
    return palette[Math.round(Math.random() * palette.length)];
  };
  const randomRadialGradient = () => {
    const palette = [...randomPalette(palettes)];
    const colors = [
      palette.splice(Math.floor(Math.random() * palette.length), 1),
      palette.splice(Math.floor(Math.random() * palette.length), 1)
    ];
    return radialGradientCSS(colors);
  };
  const radialGradientCSS = (
    colors,
    position = [0.5, 0.5],
    type = "circle",
    size = "farthest-corner"
  ) => {
    const o = {
      colors: colors,
      position: [...position],
      type: type,
      size: size,
      toString: () => {
        return `radial-gradient(${o.type} ${o.size} at ${
          o.position[0] * 100
        }% ${o.position[1] * 100}%, ${o.colors.join(", ")})`;
      }
    };
    return o;
  };
  //
  //
  const renderer = NNRenderer.create((e) => {
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
    const position = NNPhysics2D.equation(
      NNPhysics2D.position(gradients[0].position),
      NNPhysics2D.position({ x: mouse.x / vw, y: mouse.y / vh })
    );
    gradients[0].position = [position.x, position.y];

    //
    document.body.style.setProperty(
      "background-image",
      gradients
        .map((g) => {
          return g.toString();
        })
        .join(", ")
    );
  }, 1000 / 60);
  //
  //
  const mouse = NNDelegate.createPointer(document);
  mouse.start();
  mouse.onPointerDown = (e) => {
    gradients[0].colors = randomRadialGradient().colors;
  };
  mouse.onPointerUp = (e) => {};
  //
  //
  //
  //
  (async () => {
    let result;
    let url = "/src/nn-colors/nn-colors.json";
    try {
      result = await NNData.getJSON(url);
    } catch (e) {
      console.log(`error: ${e}`);
    }
    initialize({ palettes: result });
  })();
})();
