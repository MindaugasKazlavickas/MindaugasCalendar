import { chevronLeftSrc, chevronRightSrc } from "../consts/nameArrays";
import adjustMainDisplay from "./renderers/setupPanelTriggers";
function RightSideTrigger() {
  return (
    <div className="rightPanelTriggerContainer" id="rightPanelTriggerContainer">
      <button className="rightPanelTrigger iconButton">
        <img
          id="rightPanelChevron"
          src="./media/chevron_right.svg"
          alt="Right side panel trigger"
          onClick={() => {
            document
              .getElementById("rightSidePanel")
              ?.classList.toggle("notDisplayed");
            (
              document.getElementById("rightPanelChevron") as HTMLImageElement
            ).src = document
              .getElementById("rightSidePanel")
              ?.classList.contains("notDisplayed")
              ? chevronLeftSrc
              : chevronRightSrc;
            adjustMainDisplay();
          }}
        />
      </button>
    </div>
  );
}

export default RightSideTrigger;
