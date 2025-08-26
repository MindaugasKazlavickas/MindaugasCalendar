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
import reducer, { addEvent } from "./eventDisplay";

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

  test("add new event to redux and storage", () => {
    const weekKey = "events_2025_week34";
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

    console.log("state after reduction:", state);
    console.log("store contents:", store);
    console.log("parsed store:", JSON.parse(store[weekKey]));
    expect(state.actualEvents[mockTime]).toEqual(mockEvent);

    const stored = JSON.parse(store[weekKey]);
    expect(stored[mockTime]).toEqual({ ...mockEvent, id: mockTime });
  });
});
