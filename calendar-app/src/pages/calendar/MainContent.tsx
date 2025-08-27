import WeekViewTable from "./MainContent/WeekViewTimeframe";
import CalendarPanel from "./MainContent/CalendarSidePanel";
import TimeframeToday from "./MainContent/TimeframeToday";
import RightSidePanel from "./MainContent/RightSidePanel";

const CALENDAR_PANEL_WIDTH = "256px";
const RIGHT_SIDE_PANEL_WIDTH = "56px";
function Content({
  calendarPanelState,
  rightSidePanelState,
  setRightSidePanelDisplay,
}: {
  calendarPanelState: boolean;
  rightSidePanelState: boolean;
  setRightSidePanelDisplay: (
    value: boolean | ((prevVar: boolean) => boolean)
  ) => void;
}) {
  return (
    <>
      <TimeframeToday />
      <div
        className="content"
        id="content"
        data-testid="weekView"
        style={
          {
            gridTemplateColumns: `${
              calendarPanelState ? CALENDAR_PANEL_WIDTH : ""
            } 1fr ${rightSidePanelState ? RIGHT_SIDE_PANEL_WIDTH : ""}`,
          } as React.CSSProperties
        }
      >
        {calendarPanelState && <CalendarPanel />}
        <WeekViewTable />
        <RightSidePanel
          rightSidePanelState={rightSidePanelState}
          setRightSidePanelDisplay={setRightSidePanelDisplay}
        />
      </div>
    </>
  );
}

export default Content;
