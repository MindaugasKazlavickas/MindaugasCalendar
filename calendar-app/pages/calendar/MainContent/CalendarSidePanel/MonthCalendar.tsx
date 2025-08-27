import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../src/store";
import { jumpToDate } from "../../../../src/features/currentDate";

function MonthCalendar() {
  const dispatch = useDispatch();
  const monthViewDateStr = useSelector(
    (state: RootState) => state.currentDate.monthViewDate
  );

  const currentDateStr = useSelector(
    (state: RootState) => state.currentDate.currentDate
  );

  const today = new Date();
  const currentDate = new Date(currentDateStr);
  const monthViewDate = new Date(monthViewDateStr);

  const getCalendarGrid = (monthViewDate: Date): Date[] => {
    const start = new Date(
      monthViewDate.getFullYear(),
      monthViewDate.getMonth(),
      1
    );
    start.setDate(start.getDate() - start.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      days.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    return days;
  };

  const days = getCalendarGrid(monthViewDate);

  return (
    <table id="calendarTable" className="calendarTable">
      <tbody>
        {[0, 1, 2, 3, 4, 5].map((week) => (
          <tr key={week} className="calendarRow">
            {days.slice(week * 7, week * 7 + 7).map((day, i) => {
              const isToday = day.toDateString() === today.toDateString();

              const isSelected =
                day.toDateString() === currentDate.toDateString();
              const classList = [
                "calendarCell",
                isSelected && !isToday ? "calendarCellHighlighted" : "",
                isToday ? "calendarCellSelected" : "",
              ].join(" ");

              return (
                <td
                  key={i}
                  className={classList}
                  id={day.toISOString()}
                  onClick={() => {
                    dispatch(jumpToDate(day.toISOString()));
                  }}
                >
                  {day.getDate()}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default MonthCalendar;
