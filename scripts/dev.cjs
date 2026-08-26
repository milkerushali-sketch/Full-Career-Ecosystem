const { spawn } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};

  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.trim().startsWith("#"))
      .map((line) => {
        const separator = line.indexOf("=");
        if (separator === -1) return [line.trim(), ""];
        const key = line.slice(0, separator).trim();
        const value = line
          .slice(separator + 1)
          .trim()
          .replace(/^['"]|['"]$/g, "");
        return [key, value];
      }),
  );
}

const frontendEnv = {
  ...loadEnv(path.join(root, "artifacts", "placement-system", ".env")),
  ...process.env,
  PORT: process.env.PORT || "5173",
  BASE_PATH: process.env.BASE_PATH || "/",
  API_PROXY_TARGET: process.env.API_PROXY_TARGET || "http://localhost:8080",
};

const apiEnv = {
  ...loadEnv(path.join(root, "artifacts", "api-server", ".env")),
  ...process.env,
  PORT: process.env.API_PORT || "8080",
};

if (!apiEnv.DATABASE_URL) {
  console.error(
    "Missing DATABASE_URL. Create artifacts/api-server/.env before starting the app.",
  );
  console.error(
    "Example: DATABASE_URL=postgresql://postgres:password@localhost:5432/placepro",
  );
  process.exit(1);
}

if (!apiEnv.SESSION_SECRET) {
  console.error(
    "Missing SESSION_SECRET. Add it to artifacts/api-server/.env before starting the app.",
  );
  process.exit(1);
}

const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const children = [];

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

function startService(args, env, label) {
  const child = spawn(command, args, {
    cwd: root,
    env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  children.push(child);
  child.on("exit", (code) => {
    if (code && code !== 0) {
      stop();
      process.exit(code);
    }
  });
  console.log(`Starting ${label}...`);
}

async function start() {
  if (await isPortOpen(Number(apiEnv.PORT))) {
    console.log(
      `API already running on http://localhost:${apiEnv.PORT}; reusing it.`,
    );
  } else {
    startService(
      ["--filter", "@workspace/api-server", "run", "dev"],
      apiEnv,
      "API",
    );
  }

  if (await isPortOpen(Number(frontendEnv.PORT))) {
    console.log(
      `Frontend already running on http://localhost:${frontendEnv.PORT}; reusing it.`,
    );
  } else {
    startService(
      ["--filter", "@workspace/placement-system", "run", "dev"],
      frontendEnv,
      "frontend",
    );
  }
}

function stop() {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on("SIGINT", () => {
  stop();
  process.exit(0);
});
process.on("SIGTERM", () => {
  stop();
  process.exit(0);
});

start().catch((error) => {
  console.error(error);
  stop();
  process.exit(1);
});
