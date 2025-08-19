import { minToPxRatio, WeekDays } from "../consts";
import { useEffect, useMemo, useRef } from "react";
import {} from "../../../../api/displayEvents";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
function WeekviewTable({ isToday }: { isToday: boolean }) {
  const currentWeekEvents = useSelector(
    (state: RootState) => state.actualEvents.actualEvents
  );
  console.log(currentWeekEvents);
  const getDateTimeText = (hour: number): string => {
    switch (true) {
      case hour < 12:
        return `${hour} AM`;
      case hour === 12:
        return `${hour} PM`;
      case hour < 24:
        return `${hour - 12} PM`;
      default:
        return "";
    }
  };
  const tableRows = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const today = new Date();
  useEffect(() => {});
  return (
    <tbody>
      {tableRows.map((i) => (
        <tr className="weekViewGridRow" key={i}>
          <td className="weekViewGridBox timeColumn">
            {getDateTimeText(i + 1)}
          </td>
          {WeekDays.map((weekDay, j) => (
            <td
              className="weekViewGridBox"
              id={j + "_" + (+i + +1)}
              key={i + weekDay}
              style={{
                position:
                  isToday && today.getDay() === j && today.getHours() === i
                    ? "relative"
                    : "static",
                overflow:
                  isToday && today.getDay() === j && today.getHours() === i
                    ? "inherit"
                    : "none",
              }}
            >
              {isToday && today.getDay() === j && today.getHours() === i && (
                <TimeframeMarker />
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
export default WeekviewTable;

function TimeframeMarker() {
  const footerRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    if (footerRef && footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });
  const offsetTop = new Date().getMinutes() / minToPxRatio - 6;
  return (
    <div
      className="timeframeMarker"
      id="timeframeMarker"
      ref={footerRef}
      style={{ marginTop: `${offsetTop}px` }}
    >
      <span className="redDot"></span>
      <hr className="redLine" />
    </div>
  );
}
