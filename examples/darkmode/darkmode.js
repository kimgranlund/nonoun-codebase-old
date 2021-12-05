import "./darkmode.css";
import { NNTheme } from "/src/nn-theme/nn-theme.js";

(() => {
  NNTheme.initialize({
    themes: ["default", "reverse"],
    scope: document.querySelector(":root"),
    palette: [
      "--tint-000",
      "--tint-005",
      "--tint-020",
      "--tint-040",
      "--tint-060",
      "--tint-080",
      "--tint-095",
      "--tint-100"
    ]
  });
  if (NNTheme.hasStoredTheme && !NNTheme.isDefault) {
    NNTheme.reverse();
  }
  document
    .querySelector("button[data-type='default']")
    .addEventListener("click", (e) => {
      NNTheme.setTheme("default");
    });
  document
    .querySelector("button[data-type='reverse']")
    .addEventListener("click", (e) => {
      NNTheme.setTheme("reverse");
    });
  document
    .querySelector("button[data-type='toggle']")
    .addEventListener("click", (e) => {
      NNTheme.toggle();
    });
  document
    .querySelector("button[data-type='reset']")
    .addEventListener("click", (e) => {
      NNTheme.reset();
    });
})();
