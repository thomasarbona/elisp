const assert = require('assert');

const readLisp = require('../../src/lisp/read');
const evalLisp = require('../../src/lisp/eval');

const core = require('../../src/core');
const Env = require('../../src/Env');

const createEnv = () => (new Env(core));

describe('lisp/', () => {

  describe('eval', () => {

  	it('should eval a number', () => {
      const ast = evalLisp(readLisp('2'), createEnv());
      assert.strictEqual(ast, 2);
    });

    it('should eval a boolean', () => {
      const ast = evalLisp(readLisp('true'), createEnv());
      assert.strictEqual(ast, true);
    });

    it('should eval nil', () => {
      const ast = evalLisp(readLisp('nil'), createEnv());
      assert.strictEqual(ast, null);
    });

    it('should eval a string', () => {
      const ast = evalLisp(readLisp('"foo"'), createEnv());
      assert.strictEqual(ast, 'foo');
    });

    it('should eval a string with escaped char', () => {
      const ast = evalLisp(readLisp('"foo\\"bar\\""'), createEnv());
      assert.strictEqual(ast, 'foo\\"bar\\"');
    });

    it('should eval basic symbol', () => {
      const ast = evalLisp(readLisp('+'), createEnv());
      assert.strictEqual(typeof ast, 'function');
    });

    it('should eval expr with paranthesis', () => {
      const ast = evalLisp(readLisp('(+ 1 2 3)'), createEnv());
      assert.strictEqual(ast, 6);
    });

    it('should eval expr with nested paranthesis', () => {
      const ast = evalLisp(readLisp('(+ 1 2 3 (+ 4 5))'), createEnv());
      assert.strictEqual(ast, 15);
    });

    describe('def!', () => {
      it('should define a variable', () => {
        const env = createEnv();
        const ast = evalLisp(readLisp('(def! a 2)'), env);
        assert.strictEqual(ast, 2);
        const ast2 = evalLisp(readLisp('a'), env);
        assert.strictEqual(ast2, 2);
      });

      it('should define a variable from expr', () => {
        const env = createEnv();
        const ast = evalLisp(readLisp('(def! a (+ 1 2 3))'), env);
        assert.strictEqual(ast, 6);
        const ast2 = evalLisp(readLisp('a'), env);
        assert.strictEqual(ast2, 6);
      });
    });

    describe('let*', () => {
      it('should define a scope', () => {
        const env = createEnv();
        const ast = evalLisp(readLisp('(def! a 100)'), env);
        assert.strictEqual(ast, 100);
        const ast2 = evalLisp(readLisp('(let* (a 2 b 3) (+ a b))'), env);
        assert.strictEqual(ast2, 5);
        const ast3 = evalLisp(readLisp('a'), env);
        assert.strictEqual(ast3, 100);
      });
    });

    describe('if', () => {
      it('should create conditional branching', () => {
        const ast = evalLisp(readLisp('(if true 1 2)'), createEnv());
        assert.strictEqual(ast, 1);
        const ast2 = evalLisp(readLisp('(if false 1 2)'), createEnv());
        assert.strictEqual(ast2, 2);
      });
    });

    describe('do', () => {
      it('should do operations and return last', () => {
        const ast = evalLisp(readLisp('(do (def! a 10) (def! b 2) (+ a b))'), createEnv());
        assert.strictEqual(ast, 12);
      });
    });

    describe('fn*', () => {
      it('should call simple function', () => {
        const ast = evalLisp(readLisp('((fn* (a b) (+ a b)) 2 3)'), createEnv());
        assert.strictEqual(ast, 5);
      });

      it('should define and call simple function', () => {
        const env = createEnv();
        evalLisp(readLisp('(def! add (fn* (a b) (+ a b)))'), env);
        const ast = evalLisp(readLisp('(add 2 3)'), env);
        assert.strictEqual(ast, 5);
      });

      it('should define and call simple function with global vars', () => {
        const env = createEnv();
        evalLisp(readLisp('(def! x 10)'), env);
        evalLisp(readLisp('(def! add10 (fn* (a b) (+ a b x)))'), env);
        const ast = evalLisp(readLisp('(add10 2 3)'), env);
        assert.strictEqual(ast, 15);
      });
    });

    describe('quote', () => {
      it('should not eval quote', () => {
        const ast = evalLisp(readLisp('(quote (1 2 3))'), createEnv());
        assert.deepEqual(ast, [1, 2, 3]);
      });

      it('should not eval quote with function', () => {
        const ast = evalLisp(readLisp('(quote (+ 1 2 3))'), createEnv());
        ast[0] = ast[0].toString();
        assert.deepEqual(ast, ['Symbol(+)', 1, 2, 3]);
      });
    });

    describe('quasiquote', () => {
      it('should not eval quasiquote', () => {
        const ast = evalLisp(readLisp('(quasiquote (1 2 3))'), createEnv());
        assert.deepEqual(ast, [1, 2, 3]);
      });

      it('should not eval quasiquote with function', () => {
        const ast = evalLisp(readLisp('(quasiquote (+ 1 2 3))'), createEnv());
        ast[0] = ast[0].toString();
        assert.deepEqual(ast, ['Symbol(+)', 1, 2, 3]);
      });

      describe('unquote', () => {
        it('should eval unquote in quasiquote', () => {
          const ast = evalLisp(readLisp('(quasiquote (1 (unquote (+ 1 1)) 3))'), createEnv());
          assert.deepEqual(ast, [1, 2, 3]);
        });
      });

      describe('unquote-splicing', () => {
        it('should eval unquote-splicing in quasiquote and merge list', () => {
          const ast = evalLisp(readLisp('(quasiquote (1 (unquote-splicing (list 2 3)) 4))'), createEnv());
          assert.deepEqual(ast, [1, 2, 3, 4]);
        });
      });

    });

  });

});
