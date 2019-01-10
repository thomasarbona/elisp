const Env = require('../Env');
const printLisp = require('./print');

const evalAST = (ast, env) => {
  if (Array.isArray(ast)) {
    return ast.map(atom => evalLisp(atom, env));
  } else if (typeof ast === 'symbol') {
    return env.get(ast);
  }
  return ast;
};

const evalUnquote = (ast, env) => {
  if (Array.isArray(ast)) {
    return ast.map(atom => {
      if (!Array.isArray(atom) || atom[0].toString() !== 'Symbol(unquote)') {
        return atom;
      }
      return evalLisp(atom[1], env);
    });
  }
  return ast;
};

const evalLisp = (ast, env) => {
  if (!Array.isArray(ast)) {
    return evalAST(ast, env);
  }
  if (ast.length === 0) {
    return ast;
  }

  if (typeof ast[0] === 'symbol') {

    if (ast[0].toString() === 'Symbol(quote)') {
      return ast[1];
    }

    if (ast[0].toString() === 'Symbol(quasiquote)') {
      return evalUnquote(ast[1], env);
    }

    if (ast[0].toString() === 'Symbol(fn*)') {
      const func = function() {
        const scope = new Env(env);

        [].forEach.call(arguments, (arg, key) => {
          scope.set(ast[1][key], arg);
        });

        return evalLisp(ast[2], scope);
      };

      func.toString = function() {
        return printLisp(ast);
      };

      return func;
    }

    if (ast[0].toString() === 'Symbol(if)') {
      const value = evalLisp(ast[1], env);
      return evalLisp(ast[value ? 2 : 3]);
    }

    if (ast[0].toString() === 'Symbol(do)') {
      ast.shift();
      return ast.map(block => evalLisp(block, env)).pop();
    }

    if (ast[0].toString() === 'Symbol(def!)') {
      const value = evalLisp(ast[2], env);
      env.set(ast[1], value);
      return value;
    }

    if (ast[0].toString() === 'Symbol(let*)') {
      const envChild = new Env(env);

      const setters = ast[1];
      if (setters.length % 2 !== 0) {
        throw new Error('let* syntax error');
      }

      for (let it = 0; it < setters.length; it += 2) {
        const value = evalLisp(setters[it + 1], envChild);
        envChild.set(setters[it], value);
      }

      return evalLisp(ast[2], envChild);
    }

  }

  const op = evalAST(ast, env);
  if (typeof op[0] !== 'function') {
    return evalAST(op[0], env);
  }
  return op[0].apply(null, op.slice(1));
};

module.exports = evalLisp;
