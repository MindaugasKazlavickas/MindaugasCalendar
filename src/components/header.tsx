import { useEffect } from "react";
import adjustMainDisplay from "./renderers/setupPanelTriggers";
import displayDropdown from "./renderers/displayDropdown";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { resetToToday, shiftMonthView, shiftWeek } from "../currentDateSlice";
function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const currentDateStr = useSelector(
    (state: RootState) => state.currentDate.currentDate
  );
  useEffect(() => {
    const logoDate = new Date();
    const headerDateIcon = document.getElementById("logoText");
    if (headerDateIcon) {
      headerDateIcon.innerText = logoDate.getDate().toString();
    }
  });
  return (
    <header className="header">
      <div className="headerLeft">
        <button
          className="iconButton headerLeftCollapse"
          id="closeSidePanel"
          onClick={() => {
            document
              .getElementById("calendarSideView")
              ?.classList.toggle("notDisplayed");
            adjustMainDisplay();
          }}
        >
          <img src="./media/burger.svg" alt="Closes and opens calendar view" />
        </button>
        <span className="headerLeftLogo">
          <img
            className="headerLeftLogoImg"
            src="./media/logo.png"
            alt="Google Calendar's Icon"
          />
          <p id="logoText" className="headerLeftLogoText">
            31
          </p>
        </span>
        <p className="headerLeftHeading">Calendar</p>
      </div>

      <div className="headerCenter">
        <div className="headerCenterLeft">
          <button
            id="headerTodayButton"
            className="roundedCornerButton"
            onClick={() => {
              dispatch(resetToToday());
            }}
          >
            Today
          </button>
          <button
            id="previousTimeframe"
            className="iconButton"
            onClick={() => {
              dispatch(shiftWeek(-7));
              const currentMonth = new Date(currentDateStr);
              if (
                currentMonth.getMonth() >
                new Date(
                  currentMonth.setDate(currentMonth.getDate() - 7)
                ).getMonth()
              ) {
                dispatch(shiftMonthView(-1));
              }
            }}
          >
            <img src="./media/chevron_left.svg" alt="Go back a month" />
          </button>
          <button
            id="nextTimeframe"
            className="iconButton"
            onClick={() => {
              dispatch(shiftWeek(7));
              const currentMonth = new Date(currentDateStr);
              if (
                currentMonth.getMonth() <
                new Date(
                  currentMonth.setDate(currentMonth.getDate() + 7)
                ).getMonth()
              ) {
                dispatch(shiftMonthView(1));
              }
            }}
          >
            <img src="./media/chevron_right.svg" alt="Go forward a month" />
          </button>
          <p className="headerCenterLeftHeading" id="monthDisplay">
            2025
          </p>
        </div>

        <div className="headerCenterRight">
          <button className="iconButton" id="search">
            <img src="./media/search.svg" alt="Button for event search" />
          </button>
          <button className="iconButton" id="support">
            <img
              src="./media/help.svg"
              alt="Button for getting help with the calendar"
            />
          </button>
          <div className="settingsDropdown">
            <button
              className="iconButton"
              id="settings"
              onClick={() => displayDropdown("dropdownSettings")}
            >
              <img
                src="./media/settings.svg"
                alt="Button to open settings menu"
              />
            </button>
            <div
              id="dropdownSettings"
              className="dropdownSettings notDisplayed"
              tabIndex={-1}
            >
              <button id="settingsButton" className="basicButton">
                Settings
              </button>
            </div>
          </div>

          <div id="timeframeSelect">
            <button
              id="timeframeSelectButton"
              className="roundedCornerButton dropdownButton"
              onClick={() => displayDropdown("dropdownContent")}
            >
              <span>Week</span>
              <img
                className="dropdownIcon"
                src="./media/arrow_down.svg"
                alt="Timeframe type selection button"
              />
            </button>
            <div
              id="dropdownContent"
              tabIndex={-1}
              className="dropdownContent notDisplayed"
            >
              <div className="dropdownItem">
                <p>First option</p>
                <p>AB</p>
              </div>
              <div className="dropdownItem">
                <p>Second option</p>
                <p>B2</p>
              </div>
              <div className="dropdownItem">
                <p>Final option</p>
                <p>CA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="headerRight">
        <button className="iconButton" id="apps">
          <img src="./media/apps.svg" alt="Other apps selection button." />
        </button>
        <button className="roundedCornerButton" id="account">
          Account
        </button>
      </div>
    </header>
  );
}
export default Header;
