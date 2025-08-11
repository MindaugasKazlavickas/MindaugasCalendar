function fillOutWeekDays(currentDate: Date, offset: number) {
  let markerIsShown: boolean = false;
  currentDate.setDate(currentDate.getDate() + offset);
  let date = new Date(currentDate.toString());
  date.setDate(date.getDate() - date.getDay());
  const markedWeekDays = document.querySelectorAll(".weekViewGridHeader");
  markedWeekDays.forEach((classList) => {
    classList.classList.remove("weekViewGridHeaderMarked");
  });
  for (let i = 0; i < 7; i++) {
    let weekDate = document.getElementById(
      "weekDisplayDate" + i
    ) as HTMLTableCellElement;
    weekDate.innerText = date.getDate().toString();

    const todayIsInShownWeek =
      new Date().getDate() === date.getDate() &&
      new Date().getMonth() === date.getMonth() &&
      new Date().getFullYear() === date.getFullYear();

    if (todayIsInShownWeek) {
      document
        .getElementById("weekDisplayDate" + [date.getDay()])
        ?.parentElement?.classList.toggle("weekViewGridHeaderMarked");

      //enable timeframeMarker
      (
        document.getElementById("timeframeMarker") as HTMLDivElement
      ).style.display = "flex";
      markerIsShown = true;
    } else if (document.getElementById("weekDisplayDate" + [date.getDay()])) {
      document
        .getElementById("weekDisplayDate" + [date.getDay()])
        ?.parentElement?.classList.remove("weekViewGridHeaderMarked");
    }
    //disable timeframeMarker
    if (!markerIsShown) {
      markerIsShown = false;
      (
        document.getElementById("timeframeMarker") as HTMLDivElement
      ).style.display = "none";
    }
    date.setDate(date.getDate() + 1);
  }
}
export default fillOutWeekDays;
