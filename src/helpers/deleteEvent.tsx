import { SERVER_URL } from "../consts/serverURL";
import apiRequest from "./sendAPIRequest";
import { clearEvents, displayEvents } from "./displayEvents";
import { eventViewTrigger } from "./handleEventForm";
async function deleteEvent(currentDate: Date): Promise<void> {
  const imgWithId = document
    .getElementById("event")
    ?.getElementsByTagName("img")[0];
  if (!imgWithId) {
    return;
  }
  const idToDelete = imgWithId.getAttribute("id") as string;
  const result = await apiRequest<string>(
    `${SERVER_URL}/${idToDelete}`,
    "DELETE",
    "",
    idToDelete
  );

  if (result.error) {
    console.log("Error deleting event: " + result.error);
    return;
  }
  console.log("Successfully deleted event with ID: ", idToDelete);
  clearEvents();
  displayEvents(currentDate);
  eventViewTrigger();
}
export default deleteEvent;
