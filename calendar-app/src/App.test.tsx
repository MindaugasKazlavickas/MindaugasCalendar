import { act, fireEvent, render, screen } from "@testing-library/react";
import App from "./pages/App";
import { EventProvider } from "./utils/EventContext";
import { Provider } from "react-redux";
import { store } from "./store";
import getGMT from "./utils/getGMT";
import userEvent from "@testing-library/user-event";
import { StoredEvent } from "./utils/types";
import apiRequest from "./api/sendAPIRequest";
import Event from "./pages/calendar/Event";
import reducer, {
  addEvent,
  updateEvent,
  removeEvent,
  setEvents,
} from "./features/eventDisplay";
jest.mock("./pages/calendar/MainContent/TimeframeToday", () => ({
  getWeekKey: jest.fn().mockReturnValue("events_2025_week34"),
}));

describe("AppHeader", () => {
  it("renders the app, checks header text", () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    const calendar = screen.getAllByText("Calendar");
    expect(calendar[0]).toBeInTheDocument();
  });
});

describe("TimezoneGetter", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("gets Vilnius, Lithuania (local) timezone", () => {
    jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(-180);
    expect(getGMT()).toBe("GMT +03");
  });

  test("gets UTC timezone", () => {
    jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(0);
    expect(getGMT()).toBe("GMT 00");
  });

  test("gets New York timezone", () => {
    jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(240);
    expect(getGMT()).toBe("GMT -04");
  });
});

describe("EventCreationForm", () => {
  test("test event form trigger", async () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    const triggerFormButton = screen.getByTestId("eventTriggerId");
    expect(triggerFormButton).toBeInTheDocument();
    userEvent.click(screen.getByTestId("eventTriggerId"));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });
  test("checks title input field autofocus", () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    userEvent.click(screen.getByTestId("eventTriggerId"));
    const titleInput = screen.getByPlaceholderText("Add title");
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveFocus();
  });
  test("alerts for missing form fields", () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    userEvent.click(screen.getByTestId("eventTriggerId"));
    const saveButton = screen.getByTestId("eventSaveButton");
    userEvent.click(saveButton);
    expect(alertSpy).toHaveBeenCalledWith("Title is mandatory.");
    alertSpy.mockRestore();
  });

  test("fills out form fields", () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    userEvent.click(screen.getByTestId("eventTriggerId"));

    const titleInput = screen.getByPlaceholderText(/Add title/i);
    userEvent.type(titleInput, "Team daily meeting");

    const startDate = screen.getByTestId("startDate");
    fireEvent.change(startDate, { target: { value: "2025-08-30" } });
    const startTime = screen.getByTestId("startTime");
    fireEvent.change(startTime, { target: { value: "09:00" } });
    const endTime = screen.getByTestId("endTime");
    fireEvent.change(endTime, { target: { value: "10:00" } });
    const guestsInput = screen.getByPlaceholderText(/Add guests/i);
    userEvent.type(guestsInput, "John Smith");
    const locationInput = screen.getByPlaceholderText(/Add location/i);
    userEvent.type(locationInput, "Town Hall Office");
    const descriptionInput = screen.getByPlaceholderText(/Add description/i);
    userEvent.type(descriptionInput, "Discuss project updates");

    expect(titleInput).toHaveValue("Team daily meeting");
    expect(startDate).toHaveValue("2025-08-30");
    expect(startTime).toHaveValue("09:00");
    expect(endTime).toHaveValue("10:00");
    expect(guestsInput).toHaveValue("John Smith");
    expect(locationInput).toHaveValue("Town Hall Office");
    expect(descriptionInput).toHaveValue("Discuss project updates");
  });

  (apiRequest as jest.Mock).mockResolvedValue({
    status: 200,
    data: {},
    error: undefined,
  });
  test.skip("saves form and confirms redux state", async () => {
    const mockDate = new Date("August 30, 2025, 12:00:00");

    sessionStorage.clear();
    const mockEvent: StoredEvent = {
      id: 1234567890,
      title: "Test event",
      startDate: "2025-08-30",
      startTime: "13:00",
      endTime: "15:00",
      endDate: "2025-08-30",
      eventKey: "6_13",
    };

    jest.spyOn(Date.prototype, `setTime`).mockReturnValue(mockDate.getTime());
    render(
      <Provider store={store}>
        <EventProvider>
          <Event eventWindow={true} triggerEventWindow={() => {}} />
        </EventProvider>
      </Provider>
    );
    //userEvent.click(screen.getByTestId("eventTriggerId"));
    const titleInput = screen.getByPlaceholderText(/Add title/i);
    const startDate = screen.getByTestId("startDate");

    const startTime = screen.getByTestId("startTime");
    const endTime = screen.getByTestId("endTime");
    userEvent.type(titleInput, "Team daily meeting");
    fireEvent.change(startDate, { target: { value: "2025-08-30" } });
    fireEvent.change(startTime, { target: { value: "09:00" } });
    fireEvent.change(endTime, { target: { value: "10:00" } });

    const dispatchSpy = jest.spyOn(store, "dispatch");
    await act(async () => {
      userEvent.click(screen.getByTestId("eventSaveButton"));
    });

    //sessionStorage.setItem("events_2025_week34", JSON.stringify({}));

    console.log(sessionStorage.getItem("events_2025_week34"));

    const userInfo = sessionStorage.getItem("events_2025_week34");

    /*expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "events/addEvent" })
    );*/
    const savedData = JSON.parse(
      sessionStorage.getItem("events_2025_week34") || "{}"
    );
    console.log(savedData);
    expect(savedData).toBeTruthy();

    //expect(await screen.findByText(/15:00 Test/i)).not.toBeInTheDocument();
    //expect(await screen.findByRole("dialog")).not.toBeInTheDocument();

    jest.restoreAllMocks();
  });
});

describe("checks element display", () => {
  test("toggles the calendar panel", () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    const calendarPanelTrigger = screen.getByAltText(
      "Closes and opens calendar view"
    );
    const calendarPanel = screen.getByTestId("calendarSidePanel");
    userEvent.click(calendarPanelTrigger);
    expect(calendarPanel).not.toBeInTheDocument();
  });

  test("toggles the right side panel", () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    const rightSideTrigger = screen.getByAltText("Right side panel trigger");
    const rightSidePanel = screen.getByTestId("rightSidePanel");
    userEvent.click(rightSideTrigger);
    expect(rightSidePanel).not.toBeInTheDocument();
  });

  test("displays dropdown", () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    const dropdownTrigger = screen.getByTestId(
      "timeframeSelectDropdownTrigger"
    );
    const dropdownPanel = screen.getByTestId("dropdownContent");
    userEvent.hover(dropdownTrigger);
    expect(dropdownPanel).toBeInTheDocument();
  });
});

describe("CheckElementDisplay", () => {
  test("toggles the calendar panel", () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    const calendarPanelTrigger = screen.getByAltText(
      "Closes and opens calendar view"
    );
    const calendarPanel = screen.getByTestId("calendarSidePanel");
    userEvent.click(calendarPanelTrigger);
    expect(calendarPanel).not.toBeInTheDocument();
  });

  test("toggles the right side panel", () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    const rightSideTrigger = screen.getByAltText("Right side panel trigger");
    const rightSidePanel = screen.getByTestId("rightSidePanel");
    userEvent.click(rightSideTrigger);
    expect(rightSidePanel).not.toBeInTheDocument();
  });

  test("displays dropdown", () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    const dropdownTrigger = screen.getByTestId(
      "timeframeSelectDropdownTrigger"
    );
    const dropdownPanel = screen.getByTestId("dropdownContent");
    userEvent.hover(dropdownTrigger);
    expect(dropdownPanel).toBeInTheDocument();
  });
});

describe("SyncReduxAndStorage", () => {
  let store: Record<string, string>;

  jest.spyOn(global.Date, "now").mockReturnValue(1756197020781);
  beforeEach(() => {
    store = {};
    jest
      .spyOn(window.sessionStorage.__proto__, "getItem")
      .mockImplementation((key: string) => {
        return store[key] ?? null;
      });
    jest
      .spyOn(window.sessionStorage.__proto__, "setItem")
      .mockImplementation((key: string, value: string) => {
        store[key] = value;
      });
    jest
      .spyOn(window.sessionStorage.__proto__, "removeItem")
      .mockImplementation((key: string) => {
        delete store[key];
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("add new event to redux and storage", () => {
    const weekKey = "events_2025_week34";
    sessionStorage.setItem("events_2025_week34", "");
    store[weekKey] = JSON.stringify({});

    const mockEvent: StoredEvent = {
      id: 1234567890,
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

    expect(state.actualEvents[mockEvent.id]).toEqual(mockEvent);

    const stored = JSON.parse(store[weekKey]);
    expect(
      Object.values(stored).some((e: any) => e.title === "Test event")
    ).toBe(true);
  });
});
