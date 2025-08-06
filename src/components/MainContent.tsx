import WeekViewTable from "./WeekViewTable";
import CalendarPanel from "./CalendarSidePanel";
function Content() {
  return (
    <div className="content" id="content">
      <CalendarPanel />

      <WeekViewTable />

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
