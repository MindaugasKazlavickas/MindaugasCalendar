import { act, fireEvent, render, screen } from "@testing-library/react";
import App from "./pages/App";
import { EventProvider } from "./utils/EventContext";
import { Provider } from "react-redux";
import { store } from "./store";
import getGMT from "./utils/getGMT";
import Event from "./pages/calendar/Event";

process.env["NODE_DEV"] = "TEST";
let calendarSide = require("./pages/calendar/MainContent/CalendarSidePanel");
describe("AppHeader", () => {
  it("renders the app, checks header text", () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    expect(screen.getByText("Calendar")).toBeInTheDocument();
  });
});

describe("TimezoneGetter", () => {
  const OLD_TZ = process.env.TZ;

  afterEach(() => {
    process.env.TZ = OLD_TZ;
  });
  test("gets Vilnius, Lithuania (local) timezone", () => {
    expect(getGMT()).toBe("GMT +03");
  });

  test.skip("gets UTC timezone", () => {
    process.env.TZ = "UTC";
    jest.resetModules();
    expect(getGMT()).toBe("GMT +01");
  });

  test.skip("gets New York timezone", () => {
    process.env.TZ = "America/New_York";
    jest.resetModules();
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
  test("gets button", () => {
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

  test("tests button", async () => {
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    const theTrigger = jest.isMockFunction(calendarSide.eventTrigger());
    const triggerFormButton = screen.getByTestId("eventTriggerId");
    fireEvent.click(triggerFormButton);
    render(
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    );
    await act(() => {
      expect(theTrigger).toHaveBeenCalled();
    });
  });
  test.skip("checks focus", () => {
    render(
      <Event
        eventWindow={false}
        triggerEventWindow={function (value: boolean): void {
          throw new Error("Function not implemented.");
        }}
      ></Event>
    );
    const titleInput = screen.getByPlaceholderText("Add title");
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveFocus();
  });
});
