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
  data: T;
  error?: string;
}
export interface CurrentDateState {
  currentDate: string;
  monthViewDate: string;
}
