function Content() {
  return (
    <div className="content" id="content">
      <aside id="calendarSideView" className="calendarSidePanel">
        <button className="eventTrigger" id="eventWindowButton">
          <img
            className="icon"
            src="./media/add.svg"
            alt="Create event trigger"
          />
          <span>Create</span>
          <img
            className="icon"
            src="./media/arrow_down.svg"
            alt="Event creation dropdown trigger"
          />
        </button>

        <div className="calendarHeader">
          <p id="calendarMonthDisplay" className="calendarMonth">
            November, 2025
          </p>
          <div className="calendarSideViewButtons">
            <button id="previousMonth" className="smallIconButton">
              <img src="./media/chevron_left.svg" alt="Go back a month" />
            </button>
            <button id="nextMonth" className="smallIconButton">
              <img src="./media/chevron_right.svg" alt="Go forward a month" />
            </button>
          </div>
        </div>
        <div className="calendarRow">
          <p className="calendarCell">S</p>
          <p className="calendarCell">M</p>
          <p className="calendarCell">T</p>
          <p className="calendarCell">W</p>
          <p className="calendarCell">T</p>
          <p className="calendarCell">F</p>
          <p className="calendarCell">S</p>
        </div>
        <table id="calendarTable" className="calendarTable"></table>
      </aside>

      <main className="weekView">
        <table className="topWeekViewGrid" id="weekGridHeader">
          <tbody>
            <tr>
              <th className="weekViewGridHeader timeColumn" id="timezone">
                GMT +03
              </th>
              <th className="weekViewGridHeaderLeftMost"></th>
              <th className="weekViewGridHeader">
                <p className="weekViewGridHeaderWeekday">SUN</p>
                <p className="weekViewGridHeaderDate" id="weekDisplayDate0">
                  1
                </p>
              </th>
              <th className="weekViewGridHeader">
                <p className="weekViewGridHeaderWeekday">MON</p>
                <p className="weekViewGridHeaderDate" id="weekDisplayDate1">
                  2
                </p>
              </th>
              <th className="weekViewGridHeader">
                <p className="weekViewGridHeaderWeekday">TUE</p>
                <p className="weekViewGridHeaderDate" id="weekDisplayDate2">
                  3
                </p>
              </th>
              <th className="weekViewGridHeader">
                <p className="weekViewGridHeaderWeekday">WED</p>
                <p className="weekViewGridHeaderDate" id="weekDisplayDate3">
                  4
                </p>
              </th>
              <th className="weekViewGridHeader">
                <p className="weekViewGridHeaderWeekday">THU</p>
                <p className="weekViewGridHeaderDate" id="weekDisplayDate4">
                  31
                </p>
              </th>
              <th className="weekViewGridHeader">
                <p className="weekViewGridHeaderWeekday">FRI</p>
                <p className="weekViewGridHeaderDate" id="weekDisplayDate5">
                  19
                </p>
              </th>
              <th className="weekViewGridHeader">
                <p className="weekViewGridHeaderWeekday">SAT</p>
                <p className="weekViewGridHeaderDate" id="weekDisplayDate6">
                  24
                </p>
              </th>
            </tr>
            <tr className="weekViewGridRow">
              <td className="weekViewGridBoxDivider timeColumn"></td>
              <td className="weekViewGridBoxDividerLeftMost"></td>
              <td className="weekViewGridBoxDivider"></td>
              <td className="weekViewGridBoxDivider"></td>
              <td className="weekViewGridBoxDivider"></td>
              <td className="weekViewGridBoxDivider"></td>
              <td className="weekViewGridBoxDivider"></td>
              <td className="weekViewGridBoxDivider"></td>
              <td className="weekViewGridBoxDivider"></td>
            </tr>
          </tbody>
        </table>
        <table className="weekViewGrid" id="weekGrid">
          <tbody>
            <tr className="gapRow">
              <td className="weekViewGridBoxDivider timeColumn" id="timezone">
                GMT +03
              </td>
              <td className="weekViewGridBoxDividerLeftMost"></td>
              <td className="weekViewGridBoxDivider"></td>
              <td className="weekViewGridBoxDivider"></td>
              <td className="weekViewGridBoxDivider"></td>
              <td className="weekViewGridBoxDivider"></td>
              <td className="weekViewGridBoxDivider"></td>
              <td className="weekViewGridBoxDivider"></td>
              <td className="weekViewGridBoxDivider"></td>
            </tr>
          </tbody>
        </table>
      </main>

      <aside id="rightSidePanel" className="rightSideMenu">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://keep.google.com/"
        >
          <button className="asideIconButton">
            <img src="./media/keep_colored.png" alt="Open Google Keep" />
          </button>
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://tasks.google.com/tasks/"
        >
          <button className="asideIconButton">
            <img src="./media/tasks_colored.png" alt="Open Google Tasks" />
          </button>
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://contacts.google.com/"
        >
          <button className="asideIconButton">
            <img
              src="./media/contacts_colored.png"
              alt="Open Google Contacts"
            />
          </button>
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.google.com/maps"
        >
          <button className="asideIconButton">
            <img src="./media/maps_colored.png" alt="Open Google Maps" />
          </button>
        </a>
        <hr className="separator" />
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.zoom.com//"
        >
          <button className="asideIconButton">
            <img src="./media/zoom_colored.png" alt="Open Zoom" />
          </button>
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://developers.google.com/workspace/add-ons/overview"
        >
          <button className="asideIconButton">
            <img src="./media/add.svg" alt="Open adding more tools" />
          </button>
        </a>
      </aside>
    </div>
  );
}

export default Content;
