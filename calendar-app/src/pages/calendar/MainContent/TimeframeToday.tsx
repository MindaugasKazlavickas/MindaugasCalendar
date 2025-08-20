import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useEffect } from "react";
import { setEvents } from "../../../features/eventDisplay";
import { retrieveEventsFromServer } from "../../../api/getEvents";
import { StoredEvent } from "../../../utils/types";
export default function TimeframeToday() {
  const dispatch = useDispatch();
  const currentDateStr = useSelector(
    (state: RootState) => state.currentDate.currentDate
  );
  useEffect(() => {
    const currentDate = new Date(currentDateStr);

    const weekKey = getWeekKey(currentDate);

    /*const cached = sessionStorage.getItem(weekKey);
    if (cached) {
      dispatch(setEvents(JSON.parse(cached)));
      return;
    }*/

    retrieveEventsFromServer(currentDate).then((events) => {
      const eventMap: Record<string, StoredEvent> = {};

      events.forEach((event, index) => {
        const startDate = new Date(event.startDate);
        const dayOfWeek = startDate.getDay();
        const hour = +event.startTime.slice(0, 2);
        const eventKey = event.eventKey ?? `${index}_${dayOfWeek}_${hour}`;
        eventMap[eventKey] = { ...event, eventKey };
      });

      //sessionStorage.setItem(weekKey, JSON.stringify(eventMap));
      dispatch(setEvents(eventMap));
    });
  }, [currentDateStr]);
  return null;
}

export function getWeekKey(currentWeekDate: Date): string {
  const saveDate = new Date(currentWeekDate);

  const day = saveDate.getDay();
  const diff = saveDate.getDate() - day;
  const startOfWeek = new Date(saveDate.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfYear = new Date(startOfWeek.getFullYear(), 0, 1);
  const days = Math.floor((+startOfWeek - +startOfYear) / 86400000);
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `events_${startOfWeek.getFullYear()}-week${week}`;
}
