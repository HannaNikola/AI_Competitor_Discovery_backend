import { chromium } from "playwright";

export async function scrapeWebsite(url: string) {
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  const text = await page.evaluate(() => {
    return document.body.innerText;
  });

  await browser.close();

  return text.slice(0, 8000);
}




