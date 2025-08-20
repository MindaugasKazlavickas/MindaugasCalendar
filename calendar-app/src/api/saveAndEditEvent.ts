import { StoredEvent, SaveResult } from "../utils/types";
import { SERVER_URL } from "../pages/calendar/MainContent/consts";
import apiRequest from "./sendAPIRequest";
import { addEvent, updateEvent } from "../features/eventDisplay";
import { store } from "../store";

async function saveEvent(
  reduxDate: string,
  form: StoredEvent,
  id?: number
): Promise<SaveResult> {
  const isTitleEntered = !form.title || form.title.trim() === "";

  const areDatesEntered = !form.startDate || !form.startTime || !form.endTime;

  const isEndAfterStart =
    form.startDate > form.endDate ||
    !(form.startDate === form.endDate && form.startTime > form.endTime);

  if (isTitleEntered) {
    alert("Title is mandatory.");
    return { success: false, error: "Title is mandatory." };
  } else if (areDatesEntered) {
    alert("Make sure to enter start and end time and date.");
    return {
      success: false,
      error: "Make sure to enter start and end time and date.",
    };
  } else if (!isEndAfterStart) {
    alert("End time of event can not be before the start time.");
    return {
      success: false,
      error: "End time of event can not be before the start time.",
    };
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
    eventKey: form.eventKey ?? "",
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
    return {
      success: false,
      error: result.error,
    };
  } else {
    console.log("Event saved with ID: ", newEvent.id);
    console.log(result.data);
  }
  console.log(newEvent);
  return {
    success: true,
    event: newEvent,
  };
}
export default saveEvent;
