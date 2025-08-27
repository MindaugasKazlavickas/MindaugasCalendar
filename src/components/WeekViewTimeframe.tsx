import { WeekDays } from "../consts/consts";
import { useEffect, useRef } from "react";
import WeekviewTable from "./renderers/WeekViewTable";
import getGMT from "../utils/getGMT";
import { minToPxRatio } from "../consts/consts";
function WeekViewTable() {
  useEffect(() => {
    const timeframeTimezone = document.getElementById("timezone");
    if (timeframeTimezone) {
      timeframeTimezone.innerText = getGMT();
    }
  }, []);
  useEffect(() => {
    const currentWeekDay = new Date().getDay();
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    const calendarPanelOffset = 256;
    const markerHeight = 12;
    const rect = document
      .getElementById(currentWeekDay + "_" + currentHour)
      ?.getBoundingClientRect();
    const marker = document.getElementById("timeframeMarker") as HTMLDivElement;
    if (rect) {
      const sidePanelWidthOffset = rect?.x - calendarPanelOffset;
      marker.style.marginTop = currentMinutes / minToPxRatio + "px";
      marker.style.top = rect?.y - markerHeight * 2 + "px";
      marker.style.width = rect.width + "px";
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
      <table className="weekViewGrid" id="weekGrid">
        <WeekviewTable />
      </table>
    </main>
  );
}
export default WeekViewTable;

function TimeframeMarker() {
  const footerRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    if (footerRef && footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });
  return (
    <>
      <div className="timeframeMarker" id="timeframeMarker" ref={footerRef}>
        <span className="redDot"></span>
        <hr className="redLine" />
      </div>
    </>
  );
}
