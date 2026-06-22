const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const reqfails = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => reqfails.push(`${req.url()} :: ${req.failure()?.errorText || 'unknown'}`));

  const home = 'https://www.wizardalchemy.wiki/';
  await page.goto(home, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.setViewportSize({ width: 1440, height: 900 });

  const navButtons = page.locator('nav .hidden.md\\:flex button');
  const count = await navButtons.count();
  console.log(`NAV_BUTTON_COUNT=${count}`);

  for (let i = 0; i < count; i++) {
    await page.goto(home, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(500);

    const btn = navButtons.nth(i);
    const label = (await btn.innerText()).trim().replace(/\s+/g, ' ');

    try {
      await btn.click({ timeout: 10000 });
      await page.waitForTimeout(400);

      const firstLink = page.locator('nav .absolute a').first();
      const linkCount = await firstLink.count();

      if (linkCount === 0) {
        console.log(`NAV[${i}] ${label} -> DROPDOWN_EMPTY`);
        continue;
      }

      const href = await firstLink.getAttribute('href');
      await firstLink.click({ timeout: 10000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
      console.log(`NAV[${i}] ${label} -> href=${href} -> URL=${page.url()}`);
    } catch (e) {
      console.log(`NAV[${i}] ${label} -> CLICK_FAIL: ${e.message}`);
    }
  }

  console.log(`ERROR_COUNT=${errors.length}`);
  errors.forEach((e, idx) => console.log(`ERROR[${idx}] ${e}`));

  console.log(`REQFAIL_COUNT=${reqfails.length}`);
  reqfails.forEach((r, idx) => console.log(`REQFAIL[${idx}] ${r}`));

  await browser.close();
})();
