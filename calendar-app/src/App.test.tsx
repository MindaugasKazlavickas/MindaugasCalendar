import { fireEvent, render, screen } from "@testing-library/react";
import App from "./pages/App";
import { EventProvider } from "./utils/EventContext";
import { Provider } from "react-redux";
import { store } from "./store";
import getGMT from "./utils/getGMT";
import userEvent from "@testing-library/user-event";
import apiRequest from "./api/sendAPIRequest";
import saveEvent from "./api/saveAndEditEvent";
import configureMockStore from "redux-mock-store";

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

describe("changes main content's display", () => {
  //test after each{
  test.skip("checks main content size", () => {
    //click toggleRightPanel
  });
  //}

  test.skip("toggles the calendar panel", () => {
    //click toggleCalendarPanel
  });

  test.skip("toggles the right side panel", () => {
    //click toggleRightPanel
  });
});

describe("EventCreationForm", () => {
  test("gets create event button", () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    const triggerFormButton = screen.getByTestId("eventTriggerId");
    expect(triggerFormButton).toBeInTheDocument();
  });

  test("tests create event button", async () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    userEvent.click(screen.getByTestId("eventTriggerId"));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });
  test("checks title input focus", () => {
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
  test("saves form and confirms redux state", async () => {
    const mockStore = configureMockStore();
    const reduxStore = mockStore({
      events: [],
    });
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

    jest.mock("./api/sendAPIRequest");
    const mockedApiRequest = apiRequest as jest.MockedFunction<
      typeof apiRequest
    >;

    mockedApiRequest.mockResolvedValue({
      status: 200,
      data: {},
      error: undefined,
    });

    userEvent.click(screen.getByTestId("eventSaveButton"));

    const actions = reduxStore.getActions();

    expect(actions).toContainEqual(
      expect.objectContaining({
        type: "events/addEvent",
        payload: expect.objectContaining({
          title: "Team daily meeting",
          startDate: "2025-08-30",
          startTime: "09:00",
          endTime: "10:00",
          endDate: "2025-08-30",
        }),
      })
    );

    expect(screen.getByText("Team daily meeting")).toBeInTheDocument();
    expect(await screen.findByRole("dialog")).not.toBeInTheDocument();
  });
});
