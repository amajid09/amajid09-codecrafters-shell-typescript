import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
let run = true;
let invalid = true;
function runCommand() {
  rl.question("$ ", (answer) => {
    if (
      answer.split(" ").length > 1 &&
      answer.split(" ")[0] === "exit" &&
      answer.split(" ")[1] === "0"
    ) {
      run = false;
      invalid = false;
      rl.close()
    }
    if (invalid) {
      rl.write(`${answer}: command not found\n`);
    }
    if (run) {
      runCommand();
    }
  });
}

runCommand();
