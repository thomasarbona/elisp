const assert = require('assert');

class Env {
  constructor(parent = null) {
    this.data = {};
    this.parent = parent;

    if (!(this.parent instanceof Env)) {
      this.initialize(this.parent);
      this.parent = null;
    }
  }

  initialize(core) {
    Object.keys(core).forEach(key => {
      this.set(Symbol(key), core[key]);
    });
  }

  set(symbol, value) {
    assert(typeof symbol === 'symbol');
    this.data[symbol.toString()] = value;
  }

  find(symbol) {
    assert(typeof symbol === 'symbol');
    if (this.data[symbol.toString()]) {
      return this;
    }
    return this.parent && this.parent.find(symbol);
  }

  get(symbol) {
    assert(typeof symbol === 'symbol');
    const env = this.find(symbol);

    return env.data[symbol.toString()];
  }
}

module.exports = Env;
