import { formInputFieldList } from "../consts/consts";
import { StoredEvent } from "../consts/types";

export function eventViewTrigger() {
  resetEventCreationForm();
  const eventView = document.getElementById("event");
  eventView?.classList.toggle("notDisplayed");
  const eventInputTitle = document.getElementById("title");
  eventInputTitle?.focus();
}

function resetEventCreationForm() {
  formInputFieldList.forEach((formField: string) => {
    const inputField = document.getElementById(formField) as HTMLInputElement;
    inputField.value = "";
  });
  const imgWithId = document
    .getElementById("event")
    ?.getElementsByTagName("img")[0];
  imgWithId?.removeAttribute("id");
  document.getElementById("endDate")?.classList.add("notDisplayed");
}

export function openEditEventWindow(event: StoredEvent, id: string) {
  eventViewTrigger();
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
