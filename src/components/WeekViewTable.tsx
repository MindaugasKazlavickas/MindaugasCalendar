import { WeekDays } from "../consts/nameArrays";
import { useEffect } from "react";
import createDOMElement from "./renderers/createDOMElement";
import RenderTable from "./renderers/renderTable";
import getGMT from "../helpers/getGMT";
function WeekViewTable() {
  useEffect(() => {
    //RenderTableHeader();
    RenderTable();
    //RenderTableDivider();
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

function RenderTableHeader() {
  const weekHeaderRow = createDOMElement("tr");

  for (let i = 0; i < 7; i++) {
    const headerCell = createDOMElement("th", ["weekViewGridHeader"]);
    const headerDayOfWeek = createDOMElement("p", [
      "weekViewGridHeaderWeekday",
    ]);
    headerDayOfWeek.innerText = WeekDays[i];
    const headerDate = createDOMElement("p", ["weekViewGridHeaderDate"]);
    headerDate.setAttribute("id", `weekDisplayDate${i}`);
    headerDate.innerText = `${i}`;
    headerCell.appendChild(headerDayOfWeek);
    headerCell.appendChild(headerDate);
    weekHeaderRow?.appendChild(headerCell);
  }
  if (
    document.getElementById("weekGridHeader")?.getElementsByTagName("tbody")[0]
  ) {
    document
      .getElementById("weekGridHeader")
      ?.getElementsByTagName("tbody")[0]
      .remove();
  }
  const table = document.getElementById("weekGridHeader") as HTMLTableElement;
  table.createTBody() as HTMLTableSectionElement;
  document
    .getElementById("weekGridHeader")
    ?.getElementsByTagName("tbody")[0]
    .prepend(weekHeaderRow);
}

function RenderTableDivider() {
  const tableBody = document
    .getElementById("weekGridHeader")
    ?.getElementsByTagName("tbody")[0];
  const tableRow = createDOMElement("tr", ["weekViewGridRow"]);
  tableRow.appendChild(
    createDOMElement("td", ["weekViewGridBoxDivider", "timeColumn"])
  );
  for (let i = 0; i < 7; i++) {
    tableRow.appendChild(createDOMElement("td", ["weekViewGridBoxDivider"]));
  }
  tableBody?.appendChild(tableRow);
}
export default WeekViewTable;
