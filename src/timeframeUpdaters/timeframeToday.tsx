import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect } from "react";
import timeframeUpdate from "./updateTimeframe";
export default function TimeframeToday() {
  const currentDateStr = useSelector(
    (state: RootState) => state.currentDate.currentDate
  );

  useEffect(() => {
    const currentDate = new Date(currentDateStr);
    timeframeUpdate(currentDate, 0);
  }, [currentDateStr]);

  return null;
}
