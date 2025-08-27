const calendarPanelWidth = "256px";
const iconsPanelWidth = "56px";

function adjustMainDisplay(): void {
  const calendarPanel = document.getElementById("calendarSideView");
  const rightPanel = document.getElementById("rightSidePanel");
  const calendarSideWidth: string = calendarPanel?.classList.contains(
    "notDisplayed"
  )
    ? ""
    : calendarPanelWidth;
  const rightSideWidth: string = rightPanel?.classList.contains("notDisplayed")
    ? ""
    : iconsPanelWidth;
  const contentGrid = document.getElementById("content") as HTMLElement;
  contentGrid.style.gridTemplateColumns =
    calendarSideWidth + " 1fr " + rightSideWidth;
}

export default adjustMainDisplay;
