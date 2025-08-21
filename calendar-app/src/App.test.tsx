import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./pages/App";
import { EventProvider } from "./utils/EventContext";
import { Provider } from "react-redux";
import { store } from "./store";
import getGMT from "./utils/getGMT";
import { EventContextType } from "./utils/types";
import { useEventContext } from "./utils/EventContext";
import CalendarPanel from "./pages/calendar/MainContent/CalendarSidePanel";

describe("AppHeader", () => {
  it("renders the app, checks header text", () => {
    render(
      <React.StrictMode>
        <Provider store={store}>
          <EventProvider>
            <App />
          </EventProvider>
        </Provider>
      </React.StrictMode>
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

  /*
  test("gets UTC timezone", () => {
    process.env.TZ = "UTC";
    jest.resetModules();
    expect(getGMT()).toBe("GMT +01");
  });

  test("gets New York timezone", () => {
    process.env.TZ = "America/New_York";
    jest.resetModules();
    expect(getGMT()).toBe("GMT -04");
  });*/
});

test("toggles the calendar panel", () => {
  const setState = jest.fn();
  jest
    .spyOn(React, "useState")
    .mockImplementationOnce((initState) => [initState, setState]);
  render(<CalendarPanel />);
});
describe("EventCreation", () => {
  render(
    <React.StrictMode>
      <Provider store={store}>
        <EventProvider>
          <App />
        </EventProvider>
      </Provider>
    </React.StrictMode>
  );
  const onClick = jest.fn();
  const triggerFormButton = screen.getByAltText("Create event trigger");
  it("should click the button create new event", () => {
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  /*it("should open event creation form", () => {
    fireEvent.click(triggerFormButton);
    render(
      <EventProvider>
        <App />
      </EventProvider>
    );
    expect isEvent
  });*/
});
