const assert = require('assert');

const readLisp = require('../../src/lisp/read');

describe('lisp/', () => {

  describe('read', () => {

  	it('should read a number', () => {
      const ast = readLisp('2');
      assert.strictEqual(ast, 2);
    });

    it('should read a boolean', () => {
      const ast = readLisp('true');
      assert.strictEqual(ast, true);
    });

    it('should read nil', () => {
      const ast = readLisp('nil');
      assert.strictEqual(ast, null);
    });

    it('should read a string', () => {
      const ast = readLisp('"foo"');
      assert.strictEqual(ast, 'foo');
    });

    it('should read a string with escaped char', () => {
      const ast = readLisp('"foo\\"bar\\""');
      assert.strictEqual(ast, 'foo\\"bar\\"');
    });

    it('should read a symbol', () => {
      const ast = readLisp('foo');
      assert.strictEqual(ast.toString(), 'Symbol(foo)');
    });

    it('should read expr with paranthesis', () => {
      const ast = readLisp('(1 2 3)');
      assert.deepEqual(ast, [1, 2, 3]);
    });

    it('should read expr with nested paranthesis', () => {
      const ast = readLisp('(1 2 3 (4 5))');
      assert.deepEqual(ast, [1, 2, 3, [4, 5]]);
    });

    it('should read expr with nested paranthesis & multiple type', () => {
      const ast = readLisp('(nil 2 3 ("ok" 4 true))');
      assert.deepEqual(ast, [null, 2, 3, ['ok', 4, true]]);
    });

  });

});
