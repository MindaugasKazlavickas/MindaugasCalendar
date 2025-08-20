import { SERVER_URL } from "../pages/calendar/MainContent/consts";
import apiRequest from "./sendAPIRequest";
import { RequestResult, StoredEvent } from "../utils/types";
import { store } from "../store";
import { removeEvent } from "../features/eventDisplay";
async function deleteEvent(
  event: StoredEvent,
  id: number
): Promise<RequestResult> {
  if (!id) {
    return { success: false, error: "Event ID not found" };
  }
  try {
    const result = await apiRequest<string>(
      `${SERVER_URL}/${id}`,
      "DELETE",
      "",
      id.toString()
    );

    if (result.error) {
      console.log("Error deleting event: " + result.error);
      return { success: false, error: result.error };
    }
    store.dispatch(removeEvent(event));
    console.log("Successfully deleted event with ID: ", id);
    return { success: true, event: { id } as StoredEvent };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, error: (error as Error).message };
  }
}
export default deleteEvent;
