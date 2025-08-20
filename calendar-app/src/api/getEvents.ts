import { SERVER_URL } from "../pages/calendar/MainContent/consts";
import apiRequest from "./sendAPIRequest";
import { StoredEvent } from "../utils/types";

export async function retrieveEventsFromServer(
  reduxDate: Date
): Promise<StoredEvent[]> {
  const startOfWeekTime: Date = new Date(reduxDate.toString());
  startOfWeekTime.setDate(startOfWeekTime.getDate() - startOfWeekTime.getDay());
  startOfWeekTime.setHours(0, 0, 0);

  const endOfWeekTime: Date = new Date(startOfWeekTime.toString());
  endOfWeekTime.setDate(startOfWeekTime.getDate() + 7);

  const thisWeekUrl = () => {
    const startISO = startOfWeekTime.toISOString();
    const endISO = endOfWeekTime.toISOString();
    return `${SERVER_URL}?startDate_gte=${startISO}&endDate_lte=${endISO}`;
  };

  const response = await apiRequest<StoredEvent[]>(thisWeekUrl(), "GET");

  if (response.error || !response.data) {
    console.error("Error fetching events: ", response.error);
    return [];
  }

  const events = response.data;
  return events;
}
