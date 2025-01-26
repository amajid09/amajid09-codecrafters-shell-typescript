import { execSync } from "child_process";
import fs from "fs";
import path, { relative } from "path";
import { createInterface } from "readline";
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
let pwd = __dirname.split("/").slice(0, -1).join("/").trim();
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
        if (output.includes("'") || output.includes('"')) {
          const tokenizeQuotes = (output: string) => {
            let words = "";
            let word = "";
            let insideQuotes = false;
            let spaceInbetween = 0;
            let start = output.charAt(0);
            for (let char of output) {
              if (char === start) {
                insideQuotes = !insideQuotes;
                spaceInbetween = 0;
              }
              if (insideQuotes) {
                word += char !== start ? char : "";
              } else {
                words += word;
                word = "";
              }
              if (!insideQuotes && char === " ") {
                spaceInbetween++;
              }
              if (spaceInbetween === 1) {
                word += " ";
                spaceInbetween++;
              }
            }
            return words;
          };
          const words = tokenizeQuotes(output);
          rl.write(words + "\n");
        } else {
          const backSlash = (output: string) => {
            let word = "";
            let space = 0;
            let slash = "";
            for (let i = 0; i < output.length; i++) {
              const char = output.charAt(i);
              if (char === "\\") {
                if (i < output.length) {
                  slash = output.charAt(i + 1);
                }
              }
              if (char === " " || char === "\\") {
                space++;
                continue;
              } else {
                console.log('slash', slash.length) 
                let updatedChar = slash + char;
                word += space > 0 ? " " + updatedChar : updatedChar;
                console.log('word', word) 
                space = 0;
                slash = ''
              }
            }
            return word;
          };
          rl.write(backSlash(output) + "\n");
        }
        break;
      case "pwd":
        rl.write(pwd + "\n");
        break;
      case "cd":
        const dir =
          command[1].slice(0, 2) === "./"
            ? path.join(pwd, command[1].slice(1))
            : command[1];
        if (fs.existsSync(dir) || ["./", "~"].includes(dir.slice(0, 3))) {
          changeDir(dir);
        } else {
          rl.write(`cd: ${command[1]}: No such file or directory\n`);
        }
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

const changeDir = (dir: string): void => {
  //current dir
  if (dir.slice(0, 2) === "./") {
    pwd += dir.slice(1);
  } else if (dir.slice(0, 3) === "../") {
    goinback(dir);
  } else if (dir === "~") {
    pwd = process.env.HOME ?? "/home";
  } else {
    pwd = dir;
  }
};

const goinback = (path: string) => {
  if (path.length < 3) {
    return;
  }
  pwd = pwd.split("/").slice(0, -1).join("/");
  goinback(path.slice(3));
};
