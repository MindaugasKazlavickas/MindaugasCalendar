import { render, screen } from "@testing-library/react";
import App from "./pages/App";
import { EventProvider } from "./utils/EventContext";
import { Provider } from "react-redux";
import { store } from "./store";
import getGMT from "./utils/getGMT";
import userEvent from "@testing-library/user-event";
import { StoredEvent } from "./utils/types";
import Event from "./pages/calendar/Event";

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
