
const printAtom = (atom) => {
  if (typeof atom === 'symbol') {
    atom = atom.toString().replace('Symbol(', '').slice(0, -1);
  } else if (atom === null) {
    atom = 'nil';
  } else if (typeof atom === 'string') {
    atom = `"${atom
      .replace(/\n/g, "\\n")
			.replace(/\\/g, "\\\\")
			.replace(/"/g, '\\"')}"`;
  }
  return atom.toString();
};

const printLisp = (ast) => {
  let out = '';
  if (!Array.isArray(ast)) {
    out += printAtom(ast);
  } else {
    out += '(';
    out += ast.map((atom, it) => {
      return (it !== 0 ? ' ' : '') + (
        Array.isArray(atom)
          ? printLisp(atom)
          : printAtom(atom));
    }).join('');
    out += ')';
  }
  return out;
};

module.exports = printLisp;
