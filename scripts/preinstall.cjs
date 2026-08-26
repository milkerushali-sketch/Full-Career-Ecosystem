const fs = require('node:fs');
const path = require('node:path');

for (const lockfile of ['package-lock.json', 'yarn.lock']) {
  fs.rmSync(path.join(__dirname, '..', lockfile), { force: true });
}

if (!process.env.npm_config_user_agent?.startsWith('pnpm/')) {
  console.error('Use pnpm instead');
  process.exit(1);
}