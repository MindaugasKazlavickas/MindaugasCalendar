import { createContext, useContext, useState } from "react";
import { StoredEvent } from "./types";

type EventContextType = {
  selectedEventId: number | null;
  setSelectedEventId: (id: number | null) => void;
};
const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  return (
    <EventContext.Provider
      value={{
        selectedEventId,
        setSelectedEventId,
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
