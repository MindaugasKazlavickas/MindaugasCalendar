import { createContext, useContext, useState } from "react";
import { EventContextType, StoredEvent } from "./types";

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEventWindowOpen, setEventWindowOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<StoredEvent | null>(null);

  return (
    <EventContext.Provider
      value={{
        isEventWindowOpen,
        setEventWindowOpen,
        selectedEvent,
        setSelectedEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const eContext = useContext(EventContext);
  if (!eContext) throw new Error("error in useEventContext");
  return eContext;
};
