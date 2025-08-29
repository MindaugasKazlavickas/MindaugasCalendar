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
test("saving, editing and deleting event user flow", async ({ page }) => {
  //jest.spyOn(global.Date, "now").mockReturnValue(1756197020781);

  //test run locally on the designated 3001 port
  await page.goto("http://localhost:3001/");

  //open and fill out form
  await page.getByTestId("eventTriggerId").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Add title" })).toBeFocused();
  await page.getByRole("textbox", { name: "Add title" }).fill("Team meeting");
  await page.getByTestId("startDate").fill("2025-08-30");
  await page.getByTestId("startTime").fill("10:00");
  await page.getByTestId("endTime").fill("11:00");
  await page.getByTestId("locationField").click();
  await page.getByTestId("locationField").fill("Town hall office");
  await page.getByTestId("guestsField").click();
  await page.getByTestId("guestsField").fill("John Smith");
  await page.getByTestId("descriptionField").click();
  await page.getByTestId("descriptionField").fill("Discussing project goals.");

  //save and check visuals
  await page.getByTestId("eventSaveButton").click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("row", { name: "10:00 - 11:00 Team meeting" })
  ).toBeVisible();

  //open existing event and edit it
  await page
    .getByRole("cell", { name: "10:00 - 11:00 Team meeting" })
    .click({ force: true });
  //await page.waitForSelector('[role="dialog"]', { state: "visible" });
  expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Add title" })).toHaveValue(
    "Team meeting"
  );
  await page.getByRole("textbox", { name: "Add title" }).click();
  await page
    .getByRole("textbox", { name: "Add title" })
    .fill("Team meeting updated");
  await page.getByTestId("eventSaveButton").click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("row", { name: "10:00 - 11:00 Team meeting updated" })
  ).toBeVisible();

  //open existing event and delete it
  await page
    .getByRole("cell", { name: "10:00 - 11:00 Team meeting updated" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Add title" })).toHaveValue(
    "Team meeting updated"
  );
  await page.getByRole("button", { name: "Delete event" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("row", { name: "10:00 - 11:00 Team meeting updated" })
  ).not.toBeVisible();
});
