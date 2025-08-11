import { WeekDays } from "../consts/consts";
import { useEffect } from "react";
import RenderTable from "./renderers/renderTable";
import getGMT from "../utils/getGMT";
import { minToPxRatio } from "../consts/consts";
function WeekViewTable() {
  useEffect(() => {
    RenderTable();
    const timeframeTimezone = document.getElementById("timezone");
    if (timeframeTimezone) {
      timeframeTimezone.innerText = getGMT();
    }
  }, []);

  useEffect(() => {
    const currentWeekDay = new Date().getDay();
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();

    const rect = document
      .getElementById(currentWeekDay + "_" + currentHour)
      ?.getBoundingClientRect();
    const marker = document.getElementById("timeframeMarker") as HTMLDivElement;
    if (rect) {
      const sidePanelWidthOffset = rect?.x - 256 - 4; // magic number
      marker.style.marginTop = currentMinutes / minToPxRatio - 20 + "px"; // magic number
      marker.style.top = rect?.y + "px";
      marker.style.width = rect.width + 6 + "px"; // magic number
      marker.style.marginLeft = sidePanelWidthOffset + "px";
    }
  }, []);
  return (
    <main className="weekView">
      <TimeframeMarker />
      <table className="topWeekViewGrid" id="weekGridHeader">
        <tbody>
          <tr>
            <th className="weekViewGridHeader timeColumn" id="timezone"></th>
            {WeekDays.map((weekDay, i) => {
              const paragraphClass = "weekDisplayDate" + i;
              return (
                <th key={i} className="weekViewGridHeader">
                  <p className="weekViewGridHeaderWeekday">{weekDay}</p>

                  <p className="weekViewGridHeaderDate" id={paragraphClass}></p>
                </th>
              );
            })}
          </tr>
          <tr className="weekViewGridRow">
            <td className="weekViewGridBoxDivider timeColumn"></td>
            {WeekDays.map((i) => {
              return <td key={i} className="weekViewGridBoxDivider"></td>;
            })}
          </tr>
        </tbody>
      </table>
      <table className="weekViewGrid" id="weekGrid"></table>
    </main>
  );
}
export default WeekViewTable;

function TimeframeMarker() {
  return (
    <div className="timeframeMarker" id="timeframeMarker">
      <span className="redDot"></span>
      <hr className="redLine" />
    </div>
  );
}
