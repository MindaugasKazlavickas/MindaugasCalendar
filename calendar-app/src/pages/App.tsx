import Header from "./calendar/Header";
import Content from "./calendar/MainContent";
import Event from "./calendar/Event";
import { useState } from "react";
import { useEventContext } from "../utils/EventContext";
import React from "react";
function App() {
  const [isCalendarPanelOpen, setCalendarPanelOpen] = React.useState(true);
  const [isRightSidePanel, setRightSidePanel] = useState(true);
  const { isEventWindowOpen, setEventWindowOpen, selectedEvent } =
    useEventContext();
  return (
    <div className="App">
      <Header
        calendarPanelState={isCalendarPanelOpen}
        setCalendarPanelDisplay={setCalendarPanelOpen}
      />
      <Content
        calendarPanelState={isCalendarPanelOpen}
        rightSidePanelState={isRightSidePanel}
        setRightSidePanelDisplay={setRightSidePanel}
        isEventWindowOpen={isEventWindowOpen}
        triggerEventWindow={setEventWindowOpen}
      />
      {isEventWindowOpen && (
        <Event
          isEventWindowOpen={isEventWindowOpen}
          triggerEventWindow={setEventWindowOpen}
          initialEvent={selectedEvent}
        />
      )}
    </div>
  );
}

export default App;
