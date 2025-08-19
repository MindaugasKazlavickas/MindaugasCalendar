import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useEffect } from "react";
import timeframeUpdate from "../../../utils/updateTimeframe";

import { getEvents } from "../../../features/eventDisplay";
import { retrieveEventsFromServer } from "../../../api/displayEvents";
export default function TimeframeToday() {
  const dispatch = useDispatch();
  const currentDateStr = useSelector(
    (state: RootState) => state.currentDate.currentDate
  );
  useEffect(() => {
    const currentDate = new Date(currentDateStr);
    timeframeUpdate(currentDate);
    retrieveEventsFromServer(currentDate).then((events) =>
      dispatch(getEvents(events))
    );
  }, [currentDateStr]);
  return null;
}
