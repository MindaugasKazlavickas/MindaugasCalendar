//@ts-check
import { test, expect } from "@playwright/test";

test("trigger panels and compare them with screenshots", async ({ page }) => {
  //jest.spyOn(global.Date, "now").mockReturnValue(1756197020781);

  //test run locally on the designated 3001 port
  await page.goto("http://localhost:3001/");

  const weekView = page.getByTestId("weekView");
  await expect(weekView).toHaveScreenshot("weekView-initial.png");

  await page.getByTestId("calendarPanelTrigger").click();
  await expect(weekView).toHaveScreenshot("weekView-left-closed.png");

  await page.getByTestId("rightPanelTrigger").click();
  await expect(weekView).toHaveScreenshot("weekView-both-closed.png");

  await page.getByTestId("calendarPanelTrigger").click();
  await expect(weekView).toHaveScreenshot("weekView-right-closed.png");

  await page.getByTestId("rightPanelTrigger").click();
  await expect(weekView).toHaveScreenshot("weekView-initial.png");
});
