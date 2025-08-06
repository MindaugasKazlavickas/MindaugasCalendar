import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { jumpToDate } from '../features/currentDateSlice';

export default function MonthCalendar() {
  const dispatch = useDispatch();
  const monthViewDateStr = useSelector((state: RootState) => state.currentDate.monthViewDate);
  const currentDateStr = useSelector((state: RootState) => state.currentDate.currentDate);
  const today = new Date();
  const currentDate = new Date(currentDateStr);
  const monthViewDate = new Date(monthViewDateStr);

  // Get all 42 days to fill out the grid
  const getCalendarGrid = (baseDate: Date): Date[] => {
    const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    const dayOffset = start.getDay(); // Sunday = 0
    start.setDate(start.getDate() - dayOffset);
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      days.push(new Date(start.getTime() + i * 86400000));
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
              const isToday =
                day.toDateString() === today.toDateString();

              const isSelected =
                day.toDateString() === currentDate.toDateString();

              const isInMonth =
                day.getMonth() === monthViewDate.getMonth();

              const classes = [
                'calendarCell',
                isToday ? 'calendarCellSelected' : '',
                isSelected ? 'calendarCellHighlighted' : '',
                !isInMonth ? 'calendarCellOutside' : '',
              ].join(' ');

              return (
                <td
                  key={i}
                  className={classes}
                  id={day.toISOString()}
                  onClick={() => dispatch(jumpToDate(day.toISOString()))}
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