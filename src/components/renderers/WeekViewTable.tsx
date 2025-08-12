import { WeekDays } from "../../consts/consts";
import { useMemo } from "react";
function WeekviewTable() {
  const getDateTimeText = (hour: number): string => {
    switch (true) {
      case hour < 12:
        return `${hour} AM`;
      case hour === 12:
        return `${hour} PM`;
      case hour < 24:
        return `${hour - 12} PM`;
      default:
        return "";
    }
  };
  const tableRows = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  return (
    <tbody>
      {tableRows.map((i) => (
        <tr key={i}>
          <td className="weekViewGridBox timeColumn">
            {getDateTimeText(i + 1)}
          </td>
          {WeekDays.map((weekDay, j) => (
            <td
              className="weekViewGridBox"
              id={j + "_" + (+i + +1)}
              key={i + weekDay}
            ></td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
export default WeekviewTable;
