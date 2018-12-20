const readline = require('readline');
const chalk = require('chalk');

const readLisp = require('./lisp/read');
const printLisp = require('./lisp/print');
const evalLisp = require('./lisp/eval');

const core = require('./core');
const Env = require('./Env');

require('events').EventEmitter.defaultMaxListeners = 100;

const prompt = chalk.green.bold('> ');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  prompt,
});

const getEntry = () => {
  process.stdout.write(prompt);
  return new Promise(resolve => {
    rl.on('line', resolve.bind(null));
  });
};

const read = readLisp;
const print = printLisp;
const eval = evalLisp;

const env = new Env(core);

const rep = (str) => {
  const output = print(eval(read(str), env));
  process.stdout.write(`${chalk.bold(output)}\n`);
};

const run = async () => {
  while (true) {
    const line = await getEntry();
    if (line.trim() === '') {
      continue;
    }
    try {
      rep(line);
    } catch(e) {
      console.error(chalk.red.bold(`syntax error: ${e.message}`));
    }
  }
};

run().catch(err => console.error(err));
