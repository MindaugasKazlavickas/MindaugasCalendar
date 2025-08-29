import Header from "./calendar/Header";
import Content from "./calendar/MainContent";
import Event from "./calendar/Event";
import { useState } from "react";
import { useEventContext } from "../utils/EventContext";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
function App() {
  const [isCalendarPanelOpen, setCalendarPanelOpen] = React.useState(true);
  const [isRightSidePanel, setRightSidePanel] = useState(true);
  const { selectedEventId } = useEventContext();
  const isEventWindowOpen = selectedEventId !== null;

  const initialEvent = useSelector((state: RootState) => {
    const eventsArray = Object.values(state.actualEvents.actualEvents);
    return eventsArray.find((e) => e.id === selectedEventId) || null;
  });
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
      />
      {isEventWindowOpen && <Event initialEvent={initialEvent} />}
    </div>
  );
}

export default App;
