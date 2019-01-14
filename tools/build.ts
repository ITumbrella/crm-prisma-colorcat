export function exec(cmd: string) {
  console.log(cmd);
  require("child_process").execSync(cmd, { stdio: "inherit" });
}

const version = require("../package.json").version;

exec("npm install prisma@1.22.1 -g");
exec("docker-compose up -d");
exec("prisma generate");
setTimeout(() => {
  exec("prisma deploy --force");
}, 10000);
