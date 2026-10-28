const { spawn } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WEB_DIR = path.join(ROOT, 'apps/web');
const NEXT_BIN = require.resolve('next/dist/bin/next', { paths: [WEB_DIR, ROOT] });

let isShuttingDown = false;
const activeChildren = new Map();

function runProcess(name, args, cwd = ROOT, envVars = {}) {
  const child = spawn(process.execPath, ['--max-old-space-size=8192', ...args], {
    cwd,
    env: { ...process.env, ...envVars },
    stdio: 'inherit',
  });

  activeChildren.set(name, child);

  child.on('exit', (code) => {
    if (!isShuttingDown && code !== 0 && code !== null) {
      console.error(`[${name}] exited with code ${code}. Restarting in 2s...`);
      setTimeout(() => {
        if (!isShuttingDown) {
          runProcess(name, args, cwd, envVars);
        }
      }, 2000);
    }
  });

  return child;
}

console.log('\n====================================================================');
console.log('SVGCraft Monorepo (Next.js App Router Web + Crawler Studio)');
console.log('   Web Portal (Next.js):  http://localhost:3000');
console.log('   Crawler Studio:        http://localhost:3456');
console.log('====================================================================\n');

runProcess('web', [NEXT_BIN, 'dev'], WEB_DIR);
runProcess('crawler', [path.join(ROOT, 'apps/crawler/src/server.js')], ROOT);

function shutdown() {
  isShuttingDown = true;
  for (const child of activeChildren.values()) {
    try {
      child.kill('SIGTERM');
    } catch {
      // Ignore
    }
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
