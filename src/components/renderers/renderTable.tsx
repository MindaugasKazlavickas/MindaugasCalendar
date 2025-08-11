import createDOMElement from "../../helpers/createDOMElement";
function RenderTable() {
  if (document.getElementById("weekGrid")?.getElementsByTagName("tbody")[0]) {
    document
      .getElementById("weekGrid")
      ?.getElementsByTagName("tbody")[0]
      .remove();
  }
  const tableBody = (
    document.getElementById("weekGrid") as HTMLTableElement
  ).createTBody() as HTMLTableSectionElement;

  for (let i = 1; i <= 24; i++) {
    const tableRow = createDOMElement("tr", ["weekViewGridRow"]);

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

    const dayTimeCell = createDOMElement(
      "td",
      ["weekViewGridBox", "timeColumn"],
      getDateTimeText(i)
    );

    tableRow.appendChild(dayTimeCell);

    for (let j = 0; j < 7; j++) {
      const tableCell = createDOMElement("td", ["weekViewGridBox"]);
      tableCell.setAttribute("id", j + "_" + i);
      tableRow.appendChild(tableCell);
    }
    tableBody.appendChild(tableRow);
  }
  return tableBody as HTMLTableSectionElement;
}

export default RenderTable;
