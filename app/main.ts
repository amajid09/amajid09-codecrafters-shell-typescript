import { execSync } from "child_process";
import fs from "fs";
import path from "path";
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
      case "pwd":
        const currDir = __dirname.split('/').slice(0, -1).join('/').trim()
        rl.write(currDir + "\n");
        break;
      default:
        const isValid = validCommands(command[0]);
        if (isValid) {
          const stdout = execSync(command.join(" ").trim(), {
            encoding: "utf8",
          });
          rl.write(stdout.trim() + "\n");
        } else {
          rl.write(`${answer}: command not found\n`);
        }
    }
    runCommand();
  });
}

runCommand();

const typeCommand = (type: string): string => {
  const validTypes = ["echo", "exit", "type", "pwd"];
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

const validCommands = (command: string): boolean => {
  const pathsenv = process.env.PATH ?? "";

  const paths = pathsenv.split(":");
  for (let path of paths) {
    if (fs.existsSync(path + "/" + command)) {
      return true;
    }
  }
  return false;
};
