const assert = require('assert');
const exprReg = new RegExp(/\s*([()]|"(?:(\\"|[^"])*)"|[^()\s"]+)/g);

const tokenize = (str) => {
  return str.match(exprReg).map(s => s.trim());
};

const readAtom = (token) => {
  if (!isNaN(token)) {
    return +token;
  } else if (token[0] === '"') {
    return token.slice(1, -1);
  } else if (token === 'nil') {
    return null;
  } else if (token === 'true') {
    return true;
  } else if (token === 'false') {
    return false;
  }
  return Symbol(token);
};

const readList = (tokens) => {
  const result = [];
  tokens.shift();
  while (tokens[0] != ')') {
    if (tokens[0] === undefined) {
      throw new Error('syntax error');
    }
    result.push(readForm(tokens));
  }
  tokens.shift();
  return result;
};

const readForm = (tokens) => {
  switch (tokens[0]) {
    case '(':
      return readList(tokens);
    case ')':
      throw Error('syntax error');
    default:
      const token = tokens.shift();
      return readAtom(token);
  }
}

const readLisp = (str) => {
  const tokens = tokenize(str);
  return readForm(tokens);
};

module.exports = readLisp;
