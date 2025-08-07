import { WeekDays } from "../consts/nameArrays";
import { useEffect } from "react";
import RenderTable from "./renderers/renderTable";
import getGMT from "../helpers/getGMT";
function WeekViewTable() {
  useEffect(() => {
    RenderTable();
    const timeframeTimezone = document.getElementById("timezone");
    if (timeframeTimezone) {
      timeframeTimezone.innerText = getGMT();
    }
  }, []);

  return (
    <main className="weekView">
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
