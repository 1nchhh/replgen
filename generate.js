const puppeteer = require('./puppeteer');
const sleep = require('./sleep')

const sel = {
    run: {
        start: '#workspace-root > div > div.jsx-2499438306.content > div.jsx-1703838917.workspace-page-wrapper.desktop > div > div > div:nth-child(1) > header > div > div.jsx-3980429440.center > div > div.jsx-3980429440.run-button-content > div',
        ready: '#workspace-root > div > div.jsx-2499438306.content > div.jsx-1703838917.workspace-page-wrapper.desktop > div > div > div:nth-child(6) > div > iframe',
        canvas: '#workspace-root > div > div.jsx-2499438306.content > div.jsx-1703838917.workspace-page-wrapper.desktop > div > div > div:nth-child(6) > div > canvas'
    }
}

/**
 * @param {string} github {username}/{repo} format for github url
 * @param {string} cookie string for account
 *
 * @returns {any}
 */
async function generateRepl(github, cookie) {
    const page = await puppeteer.page();

    await page.setCookie({
        name: 'connect.sid',
        value: cookie,
        domain: 'replit.com',
        path: '/',
        expires: (new Date(Date.now() + (1000 * 60 * 60 * 24 * 365 * 10))).getTime() / 1000,
    });

    await page.goto('https://repl.it/github/' + github);

    const data = await page.content();

    if (data.includes('<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>')) {
        // close page
        await page.close();
        return null;
    }

    await page.waitForNavigation({ waitUntil: ['networkidle0', 'domcontentloaded'] });

    console.log('url changed')

    await sleep(1000)

    await page.waitForNavigation({ waitUntil: ['networkidle0', 'domcontentloaded'], timeout: 8000 }).catch(async () => {
    })

    console.log('fully loaded')

    await page.waitForSelector(sel.run.start);

    console.log('waiting for start')

    await waitForClass(page, sel.run.start, ['jsx-3636591325'])

    await (await page.$(sel.run.start)).click();

    await sleep(1000)

    await waitForElement(page, sel.run.canvas, 70000);

    console.log('waiting for ready')

    await page.close();
}

/**
 * 
 * @param {import('puppeteer').Page} page 
 * @param {string} selector 
 * @param {number} timeout 
 */
function waitForElement(page, selector, timeout) {
    return new Promise(resolve => {
        sleep(timeout).then(() => {
            resolve()
        })
        page.waitForSelector(selector, {
            timeout: timeout,
            visible: true,
        }).then(() => {
            resolve();
        }).catch(() => {
            resolve();
        })
    })
}

/**
 * 
 * @param {import('puppeteer').Page} page page that will be used
 * @param {string} selector selector of the element
 * @param {string[]} classes classes that the element should have
 * @param {number} timeout timeout in ms
 * @returns 
 */
function waitForClass(page, sel, classNames, timeout = 1000) {
    return new Promise(resolve => {
        const interval = setInterval(async () => {
            const classes = await (await (await (await page.$(sel)).getProperty('className')).jsonValue()).split(' ');
            const found = classes.some(c => classNames.includes(c));

            if (found) {
                clearInterval(interval);
                resolve();
            }
        }, timeout);
    })
}

module.exports = {
    generateRepl,
}
