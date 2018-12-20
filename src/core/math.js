module.exports = {
  '+': function () {
    return [...arguments].reduce((a, e) => (a + e), 0);
  },
  '-': function () {
    return [...arguments].reduce((a, e) => (a - e), 0);
  },
  '*': function () {
    return [...arguments].reduce((a, e) => (a * e), 0);
  },
  '/': function () {
    return [...arguments].reduce((a, e) => (a / e), 0);
  },
};
