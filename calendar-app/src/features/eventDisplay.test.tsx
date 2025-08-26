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
    jest.spyOn(global.Date, "now").mockReturnValue(1756197020781);

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
