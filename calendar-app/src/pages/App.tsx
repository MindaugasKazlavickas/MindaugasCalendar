import Header from "./calendar/Header";
import Content from "./calendar/MainContent";
import Event from "./calendar/Event";
import { useState } from "react";
import { useEventContext } from "../utils/EventContext";
import React from "react";
function App() {
  const [isCalendarPanel, setCalendarPanel] = React.useState(true);
  const [isRightSidePanel, setRightSidePanel] = useState(true);
  const { isEventWindow, setEventWindow } = useEventContext();
  const { selectedEvent } = useEventContext();
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
          initialEvent={selectedEvent}
        />
      )}
    </div>
  );
}

export default App;
