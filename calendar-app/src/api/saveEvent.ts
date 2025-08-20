import { StoredEvent } from "../utils/types";
import { SERVER_URL } from "../pages/calendar/MainContent/consts";
import apiRequest from "./sendAPIRequest";
import { addEvent, updateEvent } from "../features/eventDisplay";
import { store } from "../store";

async function saveEvent(
  reduxDate: string,
  form: StoredEvent,
  id?: number
): Promise<void> {
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
    eventKey: "",
  };

  let result;
  if (id) {
    result = await apiRequest<StoredEvent>(
      `${SERVER_URL}/${id}`,
      "PUT",
      newEvent
    );
    store.dispatch(updateEvent(newEvent));
  } else {
    result = await apiRequest<StoredEvent>(SERVER_URL, "POST", newEvent);
    store.dispatch(addEvent(newEvent));
  }

  if (result.error) {
    console.log("Error saving event: " + result.error);
    return;
  } else {
    console.log("Event saved with ID: ", newEvent.id);
    console.log(result.data);
  }
  console.log(newEvent);
}
export default saveEvent;
