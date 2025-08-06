import { eventViewTrigger } from "./handleEventForm";
import { displayEvents, clearEvents } from "./displayEvents";
import { StoredEvent } from "../consts/tsTypes";
import { SERVER_URL } from "../consts/serverURL";
import apiRequest from "./sendAPIRequest";

async function saveEvent(currentDate: Date): Promise<void> {
  const inputStartDate = document.getElementById(
    "startDate"
  ) as HTMLInputElement;
  const inputEndDate = document.getElementById("endDate") as HTMLInputElement;
  const inputStartTime = document.getElementById(
    "startTime"
  ) as HTMLInputElement;
  const inputEndTime = document.getElementById("endTime") as HTMLInputElement;
  const inputTitle = document.getElementById("title") as HTMLInputElement;
  const inputGuests = document.getElementById("guests") as HTMLInputElement;
  const inputLocation = document.getElementById("location") as HTMLInputElement;
  const inputDescription = document.getElementById(
    "description"
  ) as HTMLInputElement;

  const startDate = new Date(inputStartDate.value);
  const endDate = new Date(inputEndDate.value);
  const startTime = inputStartTime.value;
  const endTime = inputEndTime.value;
  const title = inputTitle.value;

  if (title === "") {
    alert("Title is mandatory.");
    return;
  } else if (
    startDate == null ||
    endDate == null ||
    startTime == null ||
    endTime == null
  ) {
    alert("Make sure to enter start and end time and date.");
    return;
  } else if (
    startDate > endDate ||
    (startDate === endDate && startTime > endTime)
  ) {
    alert("End time of event can not be before the start time.");
    return;
  }
  const newEvent: StoredEvent = {
    id: Date.now(),
    title,
    startDate: startDate.toISOString(),
    startTime,
    endDate: endDate.toISOString(),
    endTime,

    guests: inputGuests.value,
    location: inputLocation.value,
    description: inputDescription.value,
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

  eventViewTrigger();
  clearEvents();
  displayEvents(currentDate);
}
export default saveEvent;
