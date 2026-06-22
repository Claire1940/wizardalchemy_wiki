const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const home = 'https://www.wizardalchemy.wiki/';

  const errors = [];
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });

  await page.goto(home, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const navButtons = page.locator('nav .hidden.md\\:flex button');
  const count = await navButtons.count();
  console.log('COUNT', count);

  for (let i = 0; i < count; i++) {
    await page.goto(home, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(500);

    const btn = navButtons.nth(i);
    const label = (await btn.innerText()).trim().replace(/\s+/g, ' ');
    await btn.click({ timeout: 10000 });
    await page.waitForTimeout(400);

    const links = page.locator('nav .absolute a');
    const n = await links.count();
    if (!n) {
      console.log(label, 'NO_LINKS');
      continue;
    }

    const link = links.first();
    const href = await link.getAttribute('href');
    const before = page.url();

    try {
      await Promise.all([
        page.waitForURL(url => url.toString() !== before, { timeout: 8000 }),
        link.click({ timeout: 8000 })
      ]);
      console.log(label, 'NAV_OK', href, '=>', page.url());
    } catch (e) {
      console.log(label, 'NAV_FAIL', href, 'URL_STILL', page.url(), 'ERR', e.message);
    }
  }

  console.log('ERRORS', errors.length);
  errors.slice(0, 20).forEach((e, i) => console.log(i, e));
  await browser.close();
})();
