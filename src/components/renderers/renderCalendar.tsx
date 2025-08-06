import createDOMElement from "./createDOMElement";

function RenderCalendar() {
  const table = document.getElementById("calendarTable") as HTMLTableElement;
  if (table.getElementsByTagName("tbody")[0]) {
    table.getElementsByTagName("tbody")[0].remove();
  }
  const tableBody = table.createTBody() as HTMLTableSectionElement;
  for (let i = 0; i < 6; i++) {
    const calendarRow = createDOMElement("tr", ["calendarRow"]);
    for (let j = 0; j < 7; j++) {
      let dayCell = createDOMElement("td", ["calendarCell"]);
      dayCell.setAttribute("id", "calendar" + i + j);
      dayCell.innerText = `${i + j}`;
      calendarRow.appendChild(dayCell);
    }
    tableBody.appendChild(calendarRow);
  }
}

export default RenderCalendar;
