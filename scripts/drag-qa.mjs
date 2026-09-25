import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.screenshot({ path: "/workspace/screenshots/title-now.png" });
await page.getByRole("button", { name: "Começar o ritual" }).click();
await page.waitForTimeout(400);

async function dropFirstWord() {
  const buttons = page.locator("button").filter({ hasNotText: /Desfazer|Silenciar|Nova poção|Começar/ });
  const word = buttons.first();
  const pot = page.locator("[data-drop=cauldron]");
  const wb = await word.boundingBox();
  const pb = await pot.boundingBox();
  if (!wb || !pb) throw new Error("missing boxes");
  const label = (await word.innerText()).trim();
  await page.mouse.move(wb.x + wb.width / 2, wb.y + wb.height / 2);
  await page.mouse.down();
  await page.mouse.move(pb.x + pb.width / 2, pb.y + pb.height * 0.4, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(350);
  return label;
}

const first = await dropFirstWord();
console.log("dropped1", first);
const hud1 = await page.locator("footer").innerText();
console.log("hud1", hud1.replace(/\n/g, " | "));
await page.screenshot({ path: "/workspace/screenshots/qa-1of6.png" });

// undo
await page.getByRole("button", { name: "Desfazer último" }).click();
await page.waitForTimeout(300);
const afterUndo = await page.locator("body").innerText();
console.log("afterUndo has TECNICO", afterUndo.includes("TÉCNICO"));
console.log("afterUndo 0/6", afterUndo.includes("0/6"));

// play through
await dropFirstWord(); // level
for (let i = 0; i < 5; i++) {
  const t = await dropFirstWord();
  console.log("dropped", i + 2, t);
}
await page.waitForTimeout(2400);
await page.screenshot({ path: "/workspace/screenshots/qa-result.png" });
const resultText = await page.locator("body").innerText();
console.log("RESULT", resultText.slice(0, 700));

await page.goto("http://127.0.0.1:8080/admin");
await page.waitForTimeout(400);
await page.screenshot({ path: "/workspace/screenshots/qa-admin.png" });
const admin = await page.locator("h1").innerText();
console.log("ADMIN", admin, "count", await page.locator("li").count());

await browser.close();
