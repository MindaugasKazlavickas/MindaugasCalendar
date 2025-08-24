import WeekViewTable from "./MainContent/WeekViewTimeframe";
import CalendarPanel from "./MainContent/CalendarSidePanel";
import TimeframeToday from "./MainContent/TimeframeToday";
import RightSidePanel from "./MainContent/RightSidePanel";

const calendarPanelWidth = "256px";
const rightSidePanelWidth = "56px";
function Content({
  calendarPanelState,
  rightSidePanelState,
  setRightSidePanelDisplay,
  eventWindow,
  triggerEventWindow,
}: {
  calendarPanelState: boolean;
  rightSidePanelState: boolean;
  setRightSidePanelDisplay: (
    value: boolean | ((prevVar: boolean) => boolean)
  ) => void;
  eventWindow: boolean;
  triggerEventWindow: (value: boolean) => void;
}) {
  return (
    <>
      <TimeframeToday />
      <div
        className="content"
        id="content"
        style={
          {
            gridTemplateColumns: `${
              calendarPanelState ? calendarPanelWidth : ""
            } 1fr ${rightSidePanelState ? rightSidePanelWidth : ""}`,
          } as React.CSSProperties
        }
      >
        {calendarPanelState && (
          <CalendarPanel
            eventWindow={eventWindow}
            triggerEventWindow={triggerEventWindow}
          />
        )}
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
