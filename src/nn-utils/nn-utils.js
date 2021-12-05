export class NNUtils {
  static hitTestElement(target, element) {
    do {
      if (target === element) return true;
      element = element.parentNode;
    } while (element);
    return false;
  }
}

export class NNData {
  static get(url) {
    return new Promise((resolve, reject) => {
      let req = new XMLHttpRequest();
      req.open("GET", url);
      req.onload = () => {
        if (req.status === 200) {
          resolve(req.response);
        } else {
          reject(Error(`promise error with ${req.status}`));
        }
      };
      req.onerror = (err) => {
        reject(Error(`Network Error with ${url}: ${err}`));
      };
      req.send();
    });
  }
  static async getJSON(url) {
    let data, result;
    try {
      result = await NNData.get(url);
    } catch (e) {
      console.log(`error: ${e}`);
    }
    try {
      data = JSON.parse(result);
    } catch (e) {
      console.log(`parse error: ${e}`);
    }
    return data;
  }
}

export const NNRegistry = new class {
	constructor() {
    this.records = new Map();
  }
  register(key, context) {
    if (this.records.has(context)) {
      let rec = this.records.get(context);
      if (!rec.includes(key)) rec.push(key);
    } else {
      this.records.set(context, [key]);
    }
  }
  has(key, context) {
    if (this.records.has(context)) {
      return this.records.get(context).includes(key);
    }
    return false;
  }
}();