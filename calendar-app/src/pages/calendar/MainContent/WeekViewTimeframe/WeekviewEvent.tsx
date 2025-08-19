import { StoredEvent } from "../../../../utils/types";
import { minToPxRatio } from "../consts";
function DisplayEvent(event: StoredEvent) {
  //eventDuration: number[] = [];

  const startDate = new Date(event.startDate.toString());
  const endDate = new Date(event.endDate.toString());
  const startTime = event.startTime;
  const endTime = event.endTime;

  const eventDuration =
    Math.abs(+endTime.slice(0, 2) - +startTime.slice(0, 2)) * 60 +
    Math.abs(+endTime.slice(3, 5) - +startTime.slice(3, 5));
  const isSameDayEvent = (): boolean => {
    return startDate.getDate() === endDate.getDate();
  };
  const isLessThan24Hours = (): boolean => {
    const lastDayOfMonth = new Date(endDate.toString());
    lastDayOfMonth.setDate(0);
    return (
      (endDate.getDate() === startDate.getDate() + 1 &&
        endDate.getMonth() === startDate.getMonth()) ||
      startDate.getDate() === lastDayOfMonth.getDate()
    );
  };
  /*
  if (isSameDayEvent()) {
    eventDuration = eventDuration / minToPxRatio;
    //renderSameDayEvent(event, eventDuration[i]);
  } else if (isLessThan24Hours()) {
    eventDuration[i] = (24 * 60 - eventDuration[i]) / minToPxRatio;
    //renderLessThan24Hours(event, eventDuration[i]);
  }*/

  //checkOverlappingEvents(events, eventDuration);
  return null;
}

export default DisplayEvent;
