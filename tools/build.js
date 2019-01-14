var quickexec = (command, callback) => {
  console.log(command);
  require("child_process").exec(command, (error, stdout, stderr) => {
    if (error) {
      callback(error);
    } else {
      callback(null, stdout);
    }
  });
};

function exec(cmd) {
  console.log(cmd);

  require("child_process").execSync(cmd, { stdio: "inherit" });
}

exec("npm install yarn -g");
exec("yarn");
exec("yarn global add prisma@1.22.1");
exec("docker-compose up -d");
exec("prisma generate");
quickexec("prisma deploy --force", (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
});
