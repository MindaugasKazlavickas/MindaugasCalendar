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
  actualEvents: [string: StoredEvent];
}
