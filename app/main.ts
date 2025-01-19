import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function runCommand() {
  rl.question("$ ", (answer) => {
    const [command, code] = answer.split(" ");
    if (command !== "exit" && code !== "0") {
      rl.write(`${answer}: command not found\n`);
      runCommand();
    }
  });
}

runCommand();
