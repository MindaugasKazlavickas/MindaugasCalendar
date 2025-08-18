import { displayEvents, clearEvents } from "./displayEvents";
import { StoredEvent } from "../utils/types";
import { SERVER_URL } from "../pages/calendar/MainContent/consts";
import apiRequest from "./sendAPIRequest";

async function saveEvent(reduxDate: string, form: StoredEvent): Promise<void> {
  const currentDate = new Date(reduxDate);
  const isTitleEntered = form.title === "";

  const areDatesEntered =
    form.startDate == null || form.startTime == null || form.endTime == null;

  const isEndAfterStart =
    form.startDate > form.endDate ||
    !(form.startDate === form.endDate && form.startTime > form.endTime);

  if (isTitleEntered) {
    alert("Title is mandatory.");
    return;
  } else if (areDatesEntered) {
    alert("Make sure to enter start and end time and date.");
    return;
  } else if (!isEndAfterStart) {
    alert("End time of event can not be before the start time.");
    return;
  }
  if (form.endDate.toString() === "Invalid Date" || form.endDate === "") {
    form.endDate = form.startDate;
  }
  const newEvent: StoredEvent = {
    id: Date.now(),
    title: form.title,
    startDate: form.startDate,
    startTime: form.startTime,
    endDate: form.endDate,
    endTime: form.endTime,

    guests: form.guests,
    location: form.location,
    description: form.description,
  };

  const idImgHolder = document
    .getElementById("event")
    ?.getElementsByTagName("img")[0];
  let result;
  const existingEventId = idImgHolder?.getAttribute("id");
  if (idImgHolder?.getAttribute("id")) {
    result = await apiRequest<StoredEvent>(
      `${SERVER_URL}/${existingEventId}`,
      "PUT",
      newEvent
    );
  } else {
    result = await apiRequest<StoredEvent>(SERVER_URL, "POST", newEvent);
  }

  if (result.error) {
    console.log("Error saving event: " + result.error);
    return;
  } else {
    console.log("Event saved with ID: ", newEvent.id);
    console.log(result.data);
  }
  console.log(newEvent);
  clearEvents();
  displayEvents(currentDate);
}
export default saveEvent;
