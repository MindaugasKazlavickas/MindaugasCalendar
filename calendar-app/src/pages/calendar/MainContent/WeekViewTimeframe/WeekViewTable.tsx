import { minToPxRatio, WeekDays } from "../consts";
import { useMemo } from "react";
import {} from "../../../../api/getEvents";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import BuiltEventCell from "./WeekviewEvent";
import { preprocessEvents } from "./WeekviewEvent";
import { StoredEvent } from "../../../../utils/types";
import { useEventContext } from "../../../../utils/EventContext";
function WeekviewTable({ isToday }: { isToday: boolean }) {
  const { setEventWindow, setSelectedEvent } = useEventContext();
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

  console.log(preprocessedEvents);
  return (
    <table className="weekViewGrid" id="weekGrid">
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
                  position: "relative",
                }}
              >
                {isToday && today.getDay() === j && today.getHours() === i && (
                  <TimeframeMarker />
                )}

                <BuiltEventCell day={j} hour={i} events={preprocessedEvents} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default WeekviewTable;

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
