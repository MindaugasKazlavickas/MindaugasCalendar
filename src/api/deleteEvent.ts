import { SERVER_URL } from "../consts/consts";
import apiRequest from "./sendAPIRequest";
import { clearEvents, displayEvents } from "./displayEvents";
import { eventViewTrigger } from "../utils/handleEventForm";
async function deleteEvent(reduxDate: string): Promise<void> {
  const currentDate = new Date(reduxDate);
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
