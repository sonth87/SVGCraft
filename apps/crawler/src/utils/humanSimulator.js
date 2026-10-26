/**
 * Human Behavior Simulator for Playwright
 * - Random Gaussian-like delays between actions and after page loads
 * - Smooth cubic Bezier mouse cursor movement with visual cursor indicator in DOM
 * - Natural mouse wheel scrolling & random element hovering before clicking
 */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function naturalRandom(min, max) {
  const u = (Math.random() + Math.random() + Math.random()) / 3;
  return Math.round(min + u * (max - min));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class HumanSimulator {
  constructor(page, config = {}, onLog = () => {}) {
    this.page = page;
    this.onLog = onLog;
    this.cursorPos = { x: randomInt(250, 700), y: randomInt(200, 500) };
    this.updateConfig(config);
  }

  updateConfig(config = {}) {
    this.config = {
      postLoadDelayMin: Number(config.postLoadDelayMin ?? 1800),
      postLoadDelayMax: Number(config.postLoadDelayMax ?? 4200),
      actionGapMin: Number(config.actionGapMin ?? 900),
      actionGapMax: Number(config.actionGapMax ?? 2600),
      downloadGapMin: Number(config.downloadGapMin ?? 120),
      downloadGapMax: Number(config.downloadGapMax ?? 450),
      enableMouseMovement: config.enableMouseMovement !== false,
      enableRandomScroll: config.enableRandomScroll !== false,
      showVisualCursor: config.showVisualCursor !== false,
    };
  }

  async ensureVisualCursor() {
    if (!this.config.showVisualCursor) return;
    try {
      await this.page.evaluate(({ x, y }) => {
        if (document.getElementById('__agy_human_cursor__')) return;
        const cursor = document.createElement('div');
        cursor.id = '__agy_human_cursor__';
        Object.assign(cursor.style, {
          position: 'fixed',
          top: '0px',
          left: '0px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'rgba(249, 115, 22, 0.45)',
          border: '2px solid rgba(234, 88, 12, 0.95)',
          boxShadow: '0 0 12px rgba(249, 115, 22, 0.6)',
          pointerEvents: 'none',
          zIndex: '2147483647',
          transform: `translate(${x - 10}px, ${y - 10}px)`,
          transition: 'transform 0.02s linear, background-color 0.15s ease',
        });
        document.body.appendChild(cursor);
      }, this.cursorPos);
    } catch {
      // Ignore if navigation is in progress
    }
  }

  async updateVisualCursor(x, y, clicked = false) {
    if (!this.config.showVisualCursor) return;
    try {
      await this.page.evaluate(
        ({ x, y, clicked }) => {
          const cursor = document.getElementById('__agy_human_cursor__');
          if (!cursor) return;
          cursor.style.transform = `translate(${x - 10}px, ${y - 10}px) scale(${clicked ? 0.75 : 1})`;
          if (clicked) {
            cursor.style.background = 'rgba(59, 130, 246, 0.75)';
            setTimeout(() => {
              if (cursor) {
                cursor.style.background = 'rgba(249, 115, 22, 0.45)';
                cursor.style.transform = `translate(${x - 10}px, ${y - 10}px) scale(1)`;
              }
            }, 180);
          }
        },
        { x, y, clicked }
      );
    } catch {
      // Ignore context errors during navigation
    }
  }

  async waitActionGap(label = 'Nghỉ giữa thao tác') {
    const ms = naturalRandom(this.config.actionGapMin, this.config.actionGapMax);
    this.onLog(`⏱️ ${label}: chờ ${(ms / 1000).toFixed(2)}s...`, 'debug');
    await sleep(ms);
  }

  async waitPostPageLoad(pageName = 'trang') {
    const ms = naturalRandom(this.config.postLoadDelayMin, this.config.postLoadDelayMax);
    this.onLog(`⏳ Vừa tải ${pageName}, chờ tự nhiên ${(ms / 1000).toFixed(2)}s trước khi thao tác...`, 'info');
    await this.ensureVisualCursor();
    await sleep(ms);
  }

  async waitDownloadGap() {
    const ms = naturalRandom(this.config.downloadGapMin, this.config.downloadGapMax);
    await sleep(ms);
  }

  async sleep(ms) {
    await sleep(ms);
  }

  async moveMouseSmoothly(targetX, targetY, stepsOverride = null) {
    if (!this.config.enableMouseMovement) {
      this.cursorPos = { x: targetX, y: targetY };
      return;
    }

    await this.ensureVisualCursor();

    const startX = this.cursorPos.x;
    const startY = this.cursorPos.y;
    const dist = Math.hypot(targetX - startX, targetY - startY);
    const steps = stepsOverride || Math.max(12, Math.min(45, Math.round(dist / 18)));

    const cp1X = startX + (targetX - startX) * 0.3 + randomInt(-80, 80);
    const cp1Y = startY + (targetY - startY) * 0.3 + randomInt(-80, 80);
    const cp2X = startX + (targetX - startX) * 0.7 + randomInt(-60, 60);
    const cp2Y = startY + (targetY - startY) * 0.7 + randomInt(-60, 60);

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const u = 1 - easeT;

      const x =
        u * u * u * startX +
        3 * u * u * easeT * cp1X +
        3 * u * easeT * easeT * cp2X +
        easeT * easeT * easeT * targetX +
        randomInt(-1, 1);

      const y =
        u * u * u * startY +
        3 * u * u * easeT * cp1Y +
        3 * u * easeT * easeT * cp2Y +
        easeT * easeT * easeT * targetY +
        randomInt(-1, 1);

      await this.page.mouse.move(x, y);
      await this.updateVisualCursor(x, y, false);
      await sleep(randomInt(6, 18));
    }

    this.cursorPos = { x: targetX, y: targetY };
  }

  async simulatePageExploration(options = {}) {
    const { scrollPasses = randomInt(2, 4), hoverCount = randomInt(1, 3) } = options;
    await this.ensureVisualCursor();

    const viewport = this.page.viewportSize() || { width: 1440, height: 900 };

    if (this.config.enableMouseMovement) {
      for (let i = 0; i < hoverCount; i++) {
        const randX = randomInt(160, viewport.width - 160);
        const randY = randomInt(140, viewport.height - 160);
        await this.moveMouseSmoothly(randX, randY);
        await sleep(naturalRandom(250, 700));
      }
    }

    if (this.config.enableRandomScroll) {
      for (let s = 0; s < scrollPasses; s++) {
        const deltaY = naturalRandom(220, 520);
        await this.page.mouse.wheel(0, deltaY);
        await sleep(naturalRandom(400, 950));
        if (this.config.enableMouseMovement && Math.random() > 0.4) {
          const rx = randomInt(200, viewport.width - 200);
          const ry = randomInt(180, viewport.height - 180);
          await this.moveMouseSmoothly(rx, ry, 14);
        }
      }
    }
  }

  async scrollThroughPageContent(checkStop = () => false, maxSteps = 15) {
    if (!this.config.enableRandomScroll) return;
    await this.ensureVisualCursor();

    const scrollInfo = await this.page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      innerHeight: window.innerHeight,
      scrollY: window.scrollY,
    }));

    const maxScroll = Math.max(0, scrollInfo.scrollHeight - scrollInfo.innerHeight);
    let currentY = scrollInfo.scrollY;
    let stepsCount = 0;

    while (currentY < maxScroll - 100 && stepsCount < maxSteps) {
      if (checkStop()) return;
      const step = naturalRandom(280, 560);
      await this.page.mouse.wheel(0, step);
      currentY += step;
      stepsCount += 1;
      await sleep(naturalRandom(350, 850));

      if (this.config.enableMouseMovement && Math.random() > 0.45) {
        const viewport = this.page.viewportSize() || { width: 1440, height: 900 };
        await this.moveMouseSmoothly(
          randomInt(200, viewport.width - 200),
          randomInt(180, viewport.height - 180),
          15
        );
      }
    }
  }

  async humanClickLocator(locator, description = 'phần tử') {
    await locator.scrollIntoViewIfNeeded({ timeout: 10000 }).catch(() => {});
    await sleep(naturalRandom(300, 750));

    const box = await locator.boundingBox().catch(() => null);
    if (box && box.width > 4 && box.height > 4) {
      const padX = box.width * 0.2;
      const padY = box.height * 0.2;
      const targetX = Math.round(box.x + padX + Math.random() * (box.width - padX * 2));
      const targetY = Math.round(box.y + padY + Math.random() * (box.height - padY * 2));

      this.onLog(`🖱️ Di chuột tới ${description} (${targetX}, ${targetY})...`, 'debug');
      await this.moveMouseSmoothly(targetX, targetY);
      await sleep(naturalRandom(220, 620));

      await this.updateVisualCursor(targetX, targetY, true);
      await this.page.mouse.click(targetX, targetY, { delay: naturalRandom(45, 130) });
    } else {
      await locator.click({ delay: naturalRandom(45, 120) });
    }
  }
}

module.exports = {
  HumanSimulator,
  randomInt,
  naturalRandom,
  sleep,
};
