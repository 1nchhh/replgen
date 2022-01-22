const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

/**
 * @type {import('puppeteer').Browser}
 */
let browser;
/**
 * @type {() => Promise<import('puppeteer').BrowserContext>}
 */
let context;

async function init(i) {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: true,
            userDataDir: './userData' + (i ? `-${i}` : ''),
            args: [
                '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
                '--use-gl=desktop',
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
        })
        const [page] = await browser.pages();

        const session = await page.target().createCDPSession();
        const { windowId } = await session.send('Browser.getWindowForTarget');
        await session.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'minimized' } });
    }
    if (!context)
        context = async () => await browser.createIncognitoBrowserContext();
    return
}

async function page() {
    const ctx = await context();

    const page = await ctx.newPage();

    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.evaluateOnNewDocument(() => {
        // Pass webdriver check
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });
    });

    page.__close = page.close;
    page.close = async () => {
        await page.__close();
        await ctx.close();
    }

    return page;
}

module.exports = {
    init,
    page
};
