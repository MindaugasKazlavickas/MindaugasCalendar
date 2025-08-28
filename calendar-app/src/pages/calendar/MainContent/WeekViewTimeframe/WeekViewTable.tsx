import { minToPxRatio, WeekDays } from "../consts";
import { useMemo } from "react";
import {} from "../../../../api/getEvents";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import BuiltEventCell from "./WeekviewEvent";
import { preprocessEvents } from "./WeekviewEvent";

function TimeframeMarker() {
  const halfHeightOffset = 6;
  const offsetTop = new Date().getMinutes() / minToPxRatio - halfHeightOffset;

  return (
    <div
      className="timeframeMarker"
      id="timeframeMarker"
      style={{ top: `${offsetTop}px` }}
    >
      <span className="redDot"></span>
      <hr className="redLine" />
    </div>
  );
}

function WeekviewTable({ isToday }: { isToday: boolean }) {
  const tableRows = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const today = new Date();

  const currentWeekEvents = useSelector(
    (state: RootState) => state.actualEvents.actualEvents
  );

  const preprocessedEvents = useMemo(
    () => preprocessEvents(Object.values(currentWeekEvents)),
    [currentWeekEvents]
  );
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
  return (
    <table className="weekViewGrid" id="weekGrid">
      <tbody>
        {tableRows.map((hour) => (
          <tr className="weekViewGridRow" key={hour}>
            <td className="weekViewGridBox timeColumn">
              {getDateTimeText(hour + 1)}
            </td>
            {WeekDays.map((weekDay, weekDayIndex) => (
              <td
                className="weekViewGridBox"
                id={weekDayIndex + "_" + (+hour + +1)}
                key={hour + weekDay}
                style={{
                  position: "relative",
                }}
              >
                {isToday &&
                  today.getDay() === weekDayIndex &&
                  today.getHours() === hour && <TimeframeMarker />}
                {preprocessedEvents.some(
                  (event) =>
                    event.day === weekDayIndex && event.startHour === hour
                ) && (
                  <BuiltEventCell
                    day={weekDayIndex}
                    hour={hour}
                    events={preprocessedEvents}
                  />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default WeekviewTable;
