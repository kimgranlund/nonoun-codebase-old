export const NNTheme = new (class {
  constructor() {
    this.settings = {
      key: "theme"
    };
  }
  initialize(settings) {
    for (let prop in settings) this.settings[prop] = settings[prop];
    return this;
  }
  get currentTheme() {
    return this.storedTheme ? this.storedTheme : this.settings.themes[0];
  }
  get storedTheme() {
    return localStorage.getItem(this.settings.key);
  }
  get defaultTheme() {
    return this.settings.themes[0];
  }
  set storedTheme(theme) {
    localStorage.setItem(this.settings.key, theme);
  }
  reset() {
    this.setTheme(this.defaultTheme);
    localStorage.removeItem(this.settings.key);
  }
  toggle() {
    const n = this.settings.themes.indexOf(this.currentTheme) + 1;
    const theme =
      n < this.settings.themes.length
        ? this.settings.themes[n]
        : this.settings.themes[n - this.settings.themes.length];
    this.setTheme(theme);
  }
  setTheme(theme) {
    if (theme !== this.currentTheme) {
      this.storedTheme = theme;
      this.reverse();
    }
  }
  get hasStoredTheme() {
    const item = localStorage.getItem(this.settings.key);
    return item !== null;
  }
  get isDefault() {
    return this.storedTheme === this.settings.themes[0];
  }
  reverse() {
    this.reverseStyleVariables(this.settings.scope, this.settings.palette);
  }
  reverseStyleVariables(scope, props) {
    const originals = new Map(
      props.map((key) => {
        return [key, getComputedStyle(scope).getPropertyValue(key)];
      })
    );
    const values = [...originals.values()].reverse();
    const reversed = [...originals.keys()].map((key, i) => {
      return [key, values[i]];
    });
    new Map(reversed).forEach((value, key) => {
      scope.style.setProperty(key, value);
    });
  }
})();
