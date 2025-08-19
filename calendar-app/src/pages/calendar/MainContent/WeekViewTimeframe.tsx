import { WeekDays } from "./consts";
import { useEffect, useState } from "react";
import WeekviewTable from "./WeekViewTimeframe/WeekViewTable";
import getGMT from "../../../utils/getGMT";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
let markerIsShown = false;

function WeekViewTable() {
  const currentDateStr = useSelector(
    (state: RootState) => state.currentDate.currentDate
  );

  const today = new Date();
  const currentDate = new Date(currentDateStr);
  const [isMarked, setMarked] = useState(8);
  const weekStartDate = new Date(currentDate);
  weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay() - 1);

  useEffect(() => {
    const newStartDate = new Date(weekStartDate);
    newStartDate.setDate(newStartDate.getDate() - newStartDate.getDay() - 1);
    const newEndDate = new Date(
      new Date(weekStartDate).setDate(newStartDate.getDate() + 7)
    );
    const todayIsThisWeek = today > newStartDate && today < newEndDate;

    const todayIsToday = (i: number) =>
      today.getDate() === newStartDate.getDate() + i &&
      today.getMonth() === newStartDate.getMonth() &&
      today.getFullYear() === newStartDate.getFullYear();

    if (todayIsThisWeek) {
      for (let i = 0; i < 7; i++) {
        if (todayIsToday(i)) {
          setMarked(today.getDay());
        }
      }
    } else {
      setMarked(8);
    }
  }, [currentDate, today, weekStartDate]);
  return (
    <main className="weekView">
      <table className="topWeekViewGrid" id="weekGridHeader">
        <tbody>
          <tr>
            <th className="weekViewGridHeader timeColumn" id="timezone">
              {getGMT()}
            </th>
            {WeekDays.map((weekDay, i) => {
              const paragraphClass = "weekDisplayDate" + i;
              return (
                <th
                  key={i}
                  className={
                    isMarked === i
                      ? "weekViewGridHeader weekViewGridHeaderMarked"
                      : "weekViewGridHeader"
                  }
                >
                  <p className="weekViewGridHeaderWeekday">{weekDay}</p>

                  <p className="weekViewGridHeaderDate" id={paragraphClass}>
                    {new Date(
                      weekStartDate.setDate(weekStartDate.getDate() + 1)
                    ).getDate()}
                  </p>
                </th>
              );
            })}
          </tr>
          <tr className="weekViewGridRow">
            <td className="weekViewGridBoxDivider timeColumn"></td>
            {WeekDays.map((i) => {
              return <td key={i} className="weekViewGridBoxDivider"></td>;
            })}
          </tr>
        </tbody>
      </table>
      <table className="weekViewGrid" id="weekGrid">
        {isMarked < 8 ? (markerIsShown = true) : (markerIsShown = false)}
        <WeekviewTable isToday={markerIsShown} />
      </table>
    </main>
  );
}
export default WeekViewTable;
