export const events: StoredEvent[] = [
  {
    description: "Daug teksto",
    endDate: "2025-07-23T00:00:00.000Z",
    endTime: "15:39",
    guests: "Mindaugas, Jonas, Antanas",
    identifier: 1753177207351,
    location: "Sky Office",
    startDate: "2025-07-23T00:00:00.000Z",
    startTime: "12:39",
    title: "Components Team Meeting",
  },
];

interface StoredEvent {
  identifier: number;
  title: string;
  startTime: string;
  startDate: string;
  endTime: string;
  endDate: string;
  guests?: string;
  location?: string;
  description?: string;
}

export default events;
