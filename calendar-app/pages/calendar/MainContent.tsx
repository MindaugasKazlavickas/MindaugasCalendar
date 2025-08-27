import WeekViewTable from "./MainContent/WeekViewTimeframe";
import CalendarPanel from "./MainContent/CalendarSidePanel";
import TimeframeToday from "./MainContent/TimeframeToday";
import {
  rightSideButtonAlt,
  rightSideButtonHref,
  rightSideButtonSrc,
} from "./MainContent/consts";
import { Fragment } from "react/jsx-runtime";
function Content() {
  return (
    <div className="content" id="content">
      <TimeframeToday />
      <CalendarPanel />
      <WeekViewTable />

      <aside id="rightSidePanel" className="rightSideMenu">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          return (
            <Fragment key={i + "fragment"}>
              <a
                key={i}
                target="_blank"
                rel="noopener noreferrer"
                href={rightSideButtonHref[i]}
              >
                <button key={i + "button"} className="asideIconButton">
                  <img
                    key={i + "img"}
                    src={rightSideButtonSrc[i]}
                    alt={rightSideButtonAlt[i]}
                  />
                </button>
              </a>
              {i === 3 ? <hr key={i + "line"} className="separator" /> : ""}
            </Fragment>
          );
        })}
      </aside>
    </div>
  );
}

export default Content;
