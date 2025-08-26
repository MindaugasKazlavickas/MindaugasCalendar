//@ts-check
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(`
    //Mock Date.now()
     const fixedNow = 1756197020781;
     Date.now = () => fixedNow;
     
     //Mock new Date()
     const OriginalDate = Date;
     class MockDate extends OriginalDate {
     constructor(...args) {
     if (args.length === 0) {
     super(fixedNow);
     } else {
        super(...args);}
      }
        }
      MockDate.now = () => fixedNow;
      MockDate.UTC = OriginalDate.UTC;
      MockDate.parse = OriginalDate.parse;
      window.Date = MockDate`);
});

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
