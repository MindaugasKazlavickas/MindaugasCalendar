import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect } from "react";
import timeframeUpdate from "./updateTimeframe";
export default function TimeframeToday() {
  const currentDateStr = useSelector(
    (state: RootState) => state.currentDate.currentDate
  );
  const currentDate = new Date(currentDateStr);
  useEffect(() => {
    timeframeUpdate(currentDate, 0);
  }, [currentDateStr]);

  return null;
}
