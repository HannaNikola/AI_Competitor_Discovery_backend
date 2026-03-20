"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeWebsite = scrapeWebsite;
const playwright_1 = require("playwright");
async function scrapeWebsite(url) {
    const browser = await playwright_1.chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
    });
    const text = await page.evaluate(() => {
        return document.body.innerText;
    });
    await browser.close();
    return text.slice(0, 8000);
}
