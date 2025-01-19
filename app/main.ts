import { createInterface, Interface } from "readline";
import fs from "fs";
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
        rl.close();
        handleExit(code);
        break;
      case "type":
        const type = command[1];
        rl.write(typeCommand(type));
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

const typeCommand = (type: string): string => {
  const validTypes = ["echo", "exit", "type"];
  const pathsenv = process.env.PATH ?? "";
  if (validTypes.includes(type)) {
    return `${type} is a shell builtin\n`;
  }
  const paths = pathsenv.split(":");
  for (let path of paths) {
    if (fs.existsSync(path + "/" + type)) {
      return `${type} is ${path}\/${type}\n`;
    }
  }
  return `${type}: not found\n`;
};

const handleExit = (code: string): void => {
  if (code === "0") {
    process.exit(Number(code));
  }
  if (code === "1") {
    process.exit(Number(code));
  }
};
