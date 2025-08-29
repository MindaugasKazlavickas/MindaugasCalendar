import { render, screen } from "@testing-library/react";
import App from "./pages/App";
import { EventProvider } from "./utils/EventContext";
import { Provider } from "react-redux";
import { store } from "./store";
import getGMT from "./utils/getGMT";
import userEvent from "@testing-library/user-event";
import { StoredEvent } from "./utils/types";
import Event from "./pages/calendar/Event";

describe("TimezoneGetter", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("returns GMT +03 for Vilnius timezone offset", () => {
    jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(-180);
    expect(getGMT()).toBe("GMT +03");
  });

  test("returns GMT 00 for UTC timezone offset", () => {
    jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(0);
    expect(getGMT()).toBe("GMT 00");
  });

  test("returns GMT -04 for UTC -4 timezone offset", () => {
    jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(240);
    expect(getGMT()).toBe("GMT -04");
  });
});

describe("UI interactions", () => {
  const renderApp = () =>
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );

  test("header icon date displays today's date", () => {
    renderApp();
    const headerIconDate = screen.getByTestId("headerIconDate");
    expect(headerIconDate.textContent).toBe(new Date().getDate().toString());
  });

  test("toggles the calendar panel", () => {
    renderApp();
    const calendarPanelTrigger = screen.getByAltText(
      "Closes and opens calendar view"
    );
    const calendarPanel = screen.getByTestId("calendarSidePanel");
    userEvent.click(calendarPanelTrigger);
    expect(calendarPanel).not.toBeInTheDocument();
  });

  test("toggles the right side panel", () => {
    renderApp();
    const rightSideTrigger = screen.getByAltText("Right side panel trigger");
    const rightSidePanel = screen.getByTestId("rightSidePanel");
    userEvent.click(rightSideTrigger);
    expect(rightSidePanel).not.toBeInTheDocument();
  });

  test("displays dropdown", () => {
    renderApp();
    const dropdownTrigger = screen.getByRole("button", { name: /Week/i });
    const dropdownPanel = screen.getByTestId("dropdownContent");
    userEvent.hover(dropdownTrigger);
    expect(dropdownPanel).toBeInTheDocument();
  });
});
