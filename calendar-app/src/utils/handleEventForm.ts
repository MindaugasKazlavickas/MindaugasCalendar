import { formInputFieldList } from "../pages/calendar/MainContent/consts";
import { StoredEvent } from "./types";

export function openEditEventWindow(event: StoredEvent, id: string) {
  for (let i = 0; i < formInputFieldList.length; i++) {
    const key = formInputFieldList[i] as keyof StoredEvent;
    if (event[key]) {
      const inputField = document.getElementById(
        formInputFieldList[i]
      ) as HTMLInputElement;
      if (
        formInputFieldList[i] === "startDate" ||
        formInputFieldList[i] === "endDate"
      ) {
        inputField.value = (event[key] as string).slice(0, 10);
      } else {
        inputField.value = event[key] as string;
      }
    }
  }

  document.getElementById("endDate")?.classList.remove("notDisplayed");

  const idImgHolder = document
    .getElementById("event")
    ?.getElementsByTagName("img")[0];
  idImgHolder?.setAttribute("id", id);
}
