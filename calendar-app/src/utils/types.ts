export interface StoredEvent {
  id: number;
  title: string;
  startTime: string;
  startDate: string;
  endTime: string;
  endDate: string;
  guests?: string;
  location?: string;
  description?: string;
  eventKey: string;
}
export interface APIResponse<T> {
  status: number;
  data: T | undefined;
  error?: string;
}
export interface CurrentDateState {
  currentDate: string;
  monthViewDate: string;
}
export interface EventDisplayState {
  isDisplayed: boolean;
  actualEvents: Record<string, StoredEvent>;
}

export interface PreprocessedEvent {
  event: StoredEvent;
  day: number;
  startHour: number;
  startMin: number;
  durationInMinutes: number;
}
export interface BuiltEventCellProps {
  day: number;
  hour: number;
  events: PreprocessedEvent[];
}

export interface EventCellProps {
  event: StoredEvent;
  durationInMinutes: number;
  width?: number;
  leftOffset: number;
  backgroundColor?: string;
  startMin?: number;
}

export type StyledEvent = PreprocessedEvent & {
  overlapLevel: number;
  width: number;
  leftOffset: number;
  backgroundColor: string;
};

export type EventContextType = {
  isEventWindow: boolean;
  setEventWindow: (value: boolean) => void;
  selectedEvent: StoredEvent | null;
  setSelectedEvent: (event: StoredEvent | null) => void;
};

export type RequestResult =
  | { success: true; event: StoredEvent }
  | { success: false; error: string };
