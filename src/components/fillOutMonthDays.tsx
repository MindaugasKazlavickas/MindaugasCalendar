function fillOutMonthDays(currentDate: Date) {
  let workingDate = new Date(currentDate.toString());
  workingDate.setDate(1);
  workingDate.setDate(workingDate.getDate() - workingDate.getDay());
  const calendarTable = document.getElementById("calendarTable");
  const calendarTBody = calendarTable?.getElementsByTagName("tbody")[0];
  for (let i = 0; i < 6; i++) {
    const calendarRow = calendarTBody?.getElementsByClassName("calendarRow")[i];
    for (let j = 0; j < 7; j++) {
      const dayCell = calendarRow?.getElementsByClassName("calendarCell")[
        j
      ] as HTMLElement;
      dayCell.innerText = workingDate.getDate().toString();
      dayCell?.setAttribute("id", workingDate.toString());
      const isTodayDate = () => {
        return (
          workingDate.getDate() === new Date().getDate() &&
          workingDate.getMonth() === new Date().getMonth()
        );
      };
      /*const isDateSelected = () => {
        return (
          date.getDay() == new Date().getDay() &&
          date.getDate() >= currentDate.getDate() &&
          date.getDate() <= currentDate.getDate() + 6 &&
          date.getDate() != currentDate.getDate() &&
          date.getDate() == currentDate.getDate() + date.getDay() &&
          date.getMonth() == currentDate.getMonth()
        );
      };*/
      if (isTodayDate()) {
        dayCell?.classList.add("calendarCellSelected");
      } else if (workingDate.getMonth() != new Date().getMonth()) {
        dayCell?.classList.remove("calendarCellSelected");
      }
      /*if (isDateSelected()) {
        dayCell.classList.add("calendarCellHighlighted");
      } else {
        dayCell.classList.remove("calendarCellHighlighted");
      }*/
      dayCell?.classList.remove("calendarCellHighlighted");
      workingDate.setDate(workingDate.getDate() + 1);
    }
  }
}

export default fillOutMonthDays;
