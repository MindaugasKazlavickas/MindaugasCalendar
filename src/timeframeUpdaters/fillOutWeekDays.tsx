function fillOutWeekDays(currentDate: Date, offset: number) {
  currentDate.setDate(currentDate.getDate() + offset);
  let date = new Date(currentDate.toString());
  date.setDate(date.getDate() - date.getDay());
  const markedWeekDays = document.querySelectorAll(".weekViewGridHeader");
  markedWeekDays.forEach((classes) => {
    classes.classList.remove("weekViewGridHeaderMarked");
  });
  for (let i = 0; i < 7; i++) {
    let weekDate = document.getElementById(
      "weekDisplayDate" + i
    ) as HTMLTableCellElement;
    weekDate.innerText = date.getDate().toString();

    date.setDate(date.getDate() + 1);
    if (
      offset === 0 ||
      (new Date().getDate() === date.getDate() &&
        new Date().getMonth() === date.getMonth() &&
        new Date().getFullYear() === date.getFullYear())
    ) {
      document
        .getElementById("weekDisplayDate" + [currentDate.getDay()])
        ?.parentElement?.classList.toggle("weekViewGridHeaderMarked");
    } else {
    }
  }
}
export default fillOutWeekDays;
