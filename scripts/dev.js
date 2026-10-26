const { spawn } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let isShuttingDown = false;
const activeChildren = new Map();

function runProcess(name, scriptPath, envVars = {}) {
  const child = spawn(process.execPath, ['--max-old-space-size=8192', scriptPath], {
    cwd: ROOT,
    env: { ...process.env, ...envVars },
    stdio: 'inherit',
  });

  activeChildren.set(name, child);

  child.on('exit', (code) => {
    if (!isShuttingDown && code !== 0 && code !== null) {
      console.error(`⚠️ [${name}] exited with code ${code}. Tự động khởi động lại sau 2s...`);
      setTimeout(() => {
        if (!isShuttingDown) {
          runProcess(name, scriptPath, envVars);
        }
      }, 2000);
    }
  });

  return child;
}

console.log('\n====================================================================');
console.log('🚀 Khởi động Monorepo SVG Hub (Web Portal + Crawler Studio)');
console.log('   ✨ Web Thư Viện SVG (UI theSVG.org): http://localhost:3000');
console.log('   🤖 Crawler Studio (SVGRepo + theSVG): http://localhost:3456');
console.log('====================================================================\n');

runProcess('web', path.join(ROOT, 'apps/web/src/server.js'));
runProcess('crawler', path.join(ROOT, 'apps/crawler/src/server.js'));

// Auto-restart web server when backend files in apps/web/src or packages/shared/src change
const fs = require('fs');
let restartTimer = null;
function watchBackendDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
    if (!filename || !filename.endsWith('.js')) return;
    clearTimeout(restartTimer);
    restartTimer = setTimeout(() => {
      const webProc = activeChildren.get('web');
      if (webProc && !isShuttingDown) {
        console.log(`🔄 [web] Phát hiện thay đổi (${filename}), đang khởi động lại...`);
        webProc.kill('SIGTERM');
        setTimeout(() => {
          if (!isShuttingDown) {
            runProcess('web', path.join(ROOT, 'apps/web/src/server.js'));
          }
        }, 300);
      }
    }, 250);
  });
}

watchBackendDir(path.join(ROOT, 'apps/web/src'));
watchBackendDir(path.join(ROOT, 'packages/shared/src'));

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

