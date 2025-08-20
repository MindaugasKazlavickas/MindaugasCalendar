import { useDispatch } from "react-redux";
import { removeEvent } from "../features/eventDisplay";
import { SERVER_URL } from "../pages/calendar/MainContent/consts";
import apiRequest from "./sendAPIRequest";

async function deleteEvent(reduxDate: string, id: number): Promise<void> {
  const dispatch = useDispatch();
  console.log("deletion id is", id);
  if (!id) {
    return;
  }
  try {
    const result = await apiRequest<string>(
      `${SERVER_URL}/${id}`,
      "DELETE",
      "",
      id
    );

    if (result.error) {
      console.log("Error deleting event: " + result.error);
      return;
    }
    dispatch(removeEvent(id));
    console.log("Successfully deleted event with ID: ", id);
  } catch (error) {
    console.error("Failed to delete event:", error);
  }
}
export default deleteEvent;
