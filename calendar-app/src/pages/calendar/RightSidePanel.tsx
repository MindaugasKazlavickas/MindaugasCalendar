import { Fragment } from "react/jsx-runtime";
import {
  chevronLeftSrc,
  chevronRightSrc,
  rightSideButtonAlt,
  rightSideButtonHref,
  rightSideButtonSrc,
} from "./MainContent/consts";
function RightSidePanel({
  rightSidePanelState,
  setRightSidePanelDisplay,
}: {
  rightSidePanelState: boolean;
  setRightSidePanelDisplay: (
    value: boolean | ((prevVar: boolean) => boolean)
  ) => void;
}) {
  return (
    <>
      <div
        className="rightPanelTriggerContainer"
        id="rightPanelTriggerContainer"
      >
        <button
          className="rightPanelTrigger iconButton"
          onClick={() => {
            setRightSidePanelDisplay(!rightSidePanelState);
          }}
        >
          <img
            id="rightPanelChevron"
            src={rightSidePanelState ? chevronRightSrc : chevronLeftSrc}
            alt="Right side panel trigger"
          />
        </button>
      </div>
      {rightSidePanelState && (
        <aside id="rightSidePanel" className="rightSideMenu">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            return (
              <Fragment key={i + "RightSideButtonFragment"}>
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
      )}
    </>
  );
}

export default RightSidePanel;
