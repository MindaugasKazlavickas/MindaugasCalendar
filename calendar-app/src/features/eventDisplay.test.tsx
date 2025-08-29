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

import { getWeekKey } from "../pages/calendar/MainContent/TimeframeToday";
import { StoredEvent } from "../utils/types";
import reducer, { addEvent, removeEvent, updateEvent } from "./eventDisplay";

describe("eventDisplay reducer with sessionStorage sync", () => {
  let store: Record<string, string>;
  const mockTime = 1756197020781;

  const makeEvent = (overrides: Partial<StoredEvent> = {}): StoredEvent => ({
    id: mockTime,
    title: "Initial event",
    startDate: "2025-08-30",
    startTime: "15:00",
    endTime: "17:00",
    endDate: "2025-08-30",
    eventKey: "6_13",
    ...overrides,
  });

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

  test("adds a new event to redux state and session storage", () => {
    const mockEvent = makeEvent({ title: "Test event" });
    const weekKey = getWeekKey(new Date(mockEvent.startDate));
    store[weekKey] = JSON.stringify({});

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

  test("updates an existing event in redux state and session storage", () => {
    const mockEvent = makeEvent({ title: "Test event" });
    const weekKey = getWeekKey(new Date(mockEvent.startDate));
    store[weekKey] = JSON.stringify({ [mockTime]: mockEvent });

    const updatedEvent: StoredEvent = {
      ...mockEvent,
      title: "Updated Event",
    };
    const state = reducer(
      {
        isDisplayed: false,
        actualEvents: { [mockTime]: mockEvent },
      },
      updateEvent(updatedEvent)
    );
    expect(state.actualEvents[mockTime]).toEqual(updatedEvent);

    const stored = JSON.parse(store[weekKey]);
    expect(stored[mockTime]).toEqual(updatedEvent);
  });

  test("removes an existing event in redux state and session storage", () => {
    const mockEvent = makeEvent({ title: "Test event" });
    const weekKey = getWeekKey(new Date(mockEvent.startDate));
    store[weekKey] = JSON.stringify({ [mockTime]: mockEvent });

    const stateBefore = {
      isDisplayed: false,
      actualEvents: { [mockTime]: mockEvent },
    };

    const state = reducer(stateBefore, removeEvent(mockEvent));

    expect(state.actualEvents[mockTime]).toBeUndefined();
    const stored = JSON.parse(store[weekKey]);
    expect(stored[mockTime]).toBeUndefined();
  });
});
