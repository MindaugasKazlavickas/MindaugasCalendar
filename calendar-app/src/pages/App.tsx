import Header from "./calendar/Header";
import Content from "./calendar/MainContent";
import Event from "./calendar/Event";
import { useState } from "react";
import { useEventContext } from "../utils/EventContext";
function App() {
  const [isCalendarPanel, setCalendarPanel] = useState(true);
  const [isRightSidePanel, setRightSidePanel] = useState(true);
  //const [isEventWindow, setEventWindow] = useState(false);
  const { isEventWindow, setEventWindow } = useEventContext();
  return (
    <div className="App">
      <Header
        calendarPanelState={isCalendarPanel}
        setCalendarPanelDisplay={setCalendarPanel}
      />
      <Content
        calendarPanelState={isCalendarPanel}
        rightSidePanelState={isRightSidePanel}
        setRightSidePanelDisplay={setRightSidePanel}
        eventWindow={isEventWindow}
        triggerEventWindow={setEventWindow}
      />
      {isEventWindow && (
        <Event
          eventWindow={isEventWindow}
          triggerEventWindow={setEventWindow}
        />
      )}
    </div>
  );
}

export default App;
