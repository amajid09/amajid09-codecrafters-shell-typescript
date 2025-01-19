import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
function runCommand() {
  rl.question("$ ", (answer) => {
    const command = answer.split(" ");
    switch (command[0]) {
      case "exit":
        const code = command[1];
        handleExit(code);
        break;
      case "echo":
        const output = command.slice(1).join(" ");
        rl.write(output.trimStart() + "\n");
        break;
      default:
        rl.write(`${answer}: command not found\n`);
    }
    runCommand();
  });
}

runCommand();

const handleExit = (code: string): void => {
  if (code === "0") {
    process.exit(code);
  }
  if (code === "1") {
    process.exit(code);
  }
};
