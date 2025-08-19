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
  onEdit: (event: StoredEvent) => void;
}
