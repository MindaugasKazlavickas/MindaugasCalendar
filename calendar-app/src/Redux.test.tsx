import { StoredEvent } from "./utils/types";

import reducer, {
  addEvent,
  updateEvent,
  removeEvent,
  setEvents,
} from "./features/eventDisplay";

jest.mock("./pages/calendar/MainContent/TimeframeToday", () => ({
  getWeekKey: jest.fn().mockReturnValue("events_2025_week34"),
}));

describe("SyncReduxAndStorage", () => {
  let store: Record<string, string>;

  jest.spyOn(global.Date, "now").mockReturnValue(1756197020781);
  beforeEach(() => {
    store = {};
    (
      jest.spyOn(window.sessionStorage.__proto__, "getItem") as jest.Mock
    ).mockImplementation((key: string) => {
      return store[key] ?? null;
    });
    (
      jest.spyOn(window.sessionStorage.__proto__, "setItem") as jest.Mock
    ).mockImplementation((key: string, value: string) => {
      store[key] = value;
    });
    (
      jest.spyOn(window.sessionStorage.__proto__, "removeItem") as jest.Mock
    ).mockImplementation((key: string) => {
      delete store[key];
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  test("add new event to redux and storage", () => {
    const weekKey = "events_2025_week34";
    store[weekKey] = JSON.stringify({});

    const mockEvent: StoredEvent = {
      id: 1756197020781,
      title: "Test event",
      startDate: "2025-08-30",
      startTime: "13:00",
      endTime: "15:00",
      endDate: "2025-08-30",
      eventKey: "6_13",
    };

    const state = reducer(
      {
        isDisplayed: false,
        actualEvents: {},
      },
      addEvent(mockEvent)
    );

    expect(state.actualEvents[1756197020781]).toEqual(mockEvent);

    const stored = JSON.parse(store[weekKey]);
    expect(stored[1756197020781]).toEqual({ ...mockEvent, id: 1756197020781 });
  });
});
