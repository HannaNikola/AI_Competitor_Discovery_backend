import { chromium } from "playwright";

// export async function scrapeWebsite(url: string) {
//   const browser = await chromium.launch({
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     headless: true,
//   });

//   const page = await browser.newPage();

//   await page.goto(url, {
//     waitUntil: "domcontentloaded",
//     timeout: 60000,
//   });

//   const text = await page.evaluate(() => {
//     return document.body.innerText;
//   });

//   await browser.close();

//   return text.slice(0, 8000);
// }




import * as cheerio from "cheerio";

async function fetchStatic(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    $("script, style, nav, footer, header, img, svg, noscript").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim();

    if (!text) return null;

    return text.slice(0, 8000);
  } catch {
    return null;
  }
}

export async function scrapeWebsite(url: string): Promise<string> {
  // 1. Пробуем лёгкий fetch — быстро и без браузера
  const staticText = await fetchStatic(url);
  if (staticText) {
    console.log(`Static fetch succeeded: ${url}`);
    return staticText;
  }

  // 2. Fallback на Playwright для SPA и JS-сайтов
  console.log(`Falling back to Playwright: ${url}`);
  const browser = await chromium.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
    ],
    headless: true,
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  // Блокируем тяжёлые ресурсы
  await page.route("**/*", (route) => {
    const type = route.request().resourceType();
    if (["image", "media", "font", "stylesheet", "other"].includes(type)) {
      return route.abort();
    }
    return route.continue();
  });

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await page.waitForTimeout(2000);

    const text = await page.evaluate(() => {
      document
        .querySelectorAll(
          "nav, footer, header, script, style, img, svg, iframe," +
            ".cookie-banner, .popup, .modal, .overlay, .banner, .ad"
        )
        .forEach((el) => el.remove());

      return document.body.innerText.replace(/\s+/g, " ").trim();
    });

    return text ? text.slice(0, 8000) : "";
  } catch (err) {
    console.warn(`Playwright failed for ${url}:`, (err as Error).message);
    return ""; // validatePageNode выше поймает пустую строку
  } finally {
    await context.close();
    await browser.close();
  }
}
