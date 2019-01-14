import * as commander from 'commander';

function exec(cmd: string) {
  console.log(cmd);
  require("child_process").execSync(cmd, { stdio: "inherit" });
}

const version = require("../package.json").version;

commander.version(version);

exec("npm install prisma@1.22.1 -g");
exec("prisma deploy");
exec("prisma generate");
exec("npm ");
