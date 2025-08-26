/* eslint-disable import/first */

jest.mock("../pages/calendar/MainContent/TimeframeToday", () => {
  const actual = jest.requireActual(
    "../pages/calendar/MainContent/TimeframeToday"
  );
  return {
    __esModule: true,
    getWeekKey: () => "events_2025_week34",
  };
});

import { StoredEvent } from "../utils/types";
import reducer, { addEvent, removeEvent, updateEvent } from "./eventDisplay";

describe("SyncReduxAndStorage", () => {
  let store: Record<string, string>;
  const mockTime = 1756197020781;

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(mockTime));
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    store = {};

    jest.clearAllMocks();

    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: jest.fn((key) => store[key]),
        setItem: jest.fn((key, value) => {
          store[key] = value;
        }),
        removeItem: jest.fn((key) => {
          delete store[key];
        }),
      },
      writable: true,
    });
  });
  const weekKey = "events_2025_week34";
  test("add new event to redux and storage", () => {
    store[weekKey] = JSON.stringify({});

    const mockEvent: StoredEvent = {
      id: mockTime,
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
    expect(state.actualEvents[mockTime]).toEqual(mockEvent);

    const stored = JSON.parse(store[weekKey]);
    expect(stored[mockTime]).toEqual({ ...mockEvent, id: mockTime });
  });

  test("update an existing event in redux and storage", () => {
    const initialEvent: StoredEvent = {
      id: mockTime,
      title: "Initial event",
      startDate: "2025-08-30",
      startTime: "15:00",
      endTime: "17:00",
      endDate: "2025-08-30",
      eventKey: "6_13",
    };
    store[weekKey] = JSON.stringify({ [mockTime]: initialEvent });

    const updatedEvent: StoredEvent = {
      ...initialEvent,
      title: "Updated Event",
    };
    const state = reducer(
      {
        isDisplayed: false,
        actualEvents: { [mockTime]: initialEvent },
      },
      updateEvent(updatedEvent)
    );
    expect(state.actualEvents[mockTime]).toEqual(updatedEvent);

    const stored = JSON.parse(store[weekKey]);
    expect(stored[mockTime]).toEqual(updatedEvent);
  });

  test("remove an existing event in redux and storage", () => {
    const initialEvent: StoredEvent = {
      id: mockTime,
      title: "Initial event",
      startDate: "2025-08-30",
      startTime: "15:00",
      endTime: "17:00",
      endDate: "2025-08-30",
      eventKey: "6_13",
    };
    store[weekKey] = JSON.stringify({ [mockTime]: initialEvent });

    const stateBefore = {
      isDisplayed: false,
      actualEvents: { [mockTime]: initialEvent },
    };

    const state = reducer(stateBefore, removeEvent(initialEvent));

    expect(state.actualEvents[mockTime]).toBeUndefined();
    const stored = JSON.parse(store[weekKey]);
    expect(stored[mockTime]).toBeUndefined();
  });
});
