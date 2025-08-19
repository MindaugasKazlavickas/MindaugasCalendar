import { StoredEvent } from "../../../../utils/types";
import { minToPxRatio } from "../consts";
function BuiltEventCell({ day, hour, events, onEdit }: any) {
  const cellEvents = events.filter(
    (e) => e.day === day && e.startHour === hour
  );
  const styledEvents = setupOverlaps(cellEvents);

  return (
    <>
      {styledEvents.map((e) => (
        <EventCell
          key={e.event.id + "_" + e.day + "_" + e.startHour}
          event={e.event}
          durationInMinutes={e.durationInMinutes}
          startMin={+e.event.startTime.slice(3, 5)}
          width={e.width}
          backgroundColor={e.backgroundColor}
          onEdit={onEdit}
        />
      ))}
    </>
  );
}
export default BuiltEventCell;
function preprocessEvents(events: StoredEvent[]) {
  const setupEvent: {
    event: StoredEvent;
    day: number;
    startHour: number;
    durationInMinutes: number;
  }[] = [];

  events.forEach((event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const startHour = +event.startTime.slice(0, 2);
    const startMin = +event.startTime.slice(3, 5);
    const endHour = +event.endTime.slice(0, 2);
    const endMin = +event.endTime.slice(3, 5);

    const durationInMinutes = (endHour - startHour) * 60 + (endMin - startMin);

    if (startDate.toString() === endDate.toString()) {
      setupEvent.push({
        event,
        day: startDate.getDay(),
        startHour,
        durationInMinutes,
      });
    } else {
      const firstDayMins = 24 * 60 - (startHour * 60 + startMin);
      setupEvent.push({
        event,
        day: startDate.getDay(),
        startHour,
        durationInMinutes: firstDayMins,
      });
      const secondDayMins = durationInMinutes - firstDayMins;
      setupEvent.push({
        event,
        day: endDate.getDay(),
        startHour: 0,
        durationInMinutes: secondDayMins,
      });
    }
  });
  return setupEvent;
}

function setupOverlaps(eventsInCell: (typeof preprocessEvents)[0][]) {
  return eventsInCell.map((event, id, array) => {
    let overlap = 0;
    array.forEach((item, i) => {
      if (id !== i) {
        const start1 = event.startHour * 60;
        const end1 = event.startHour * 60 + event.durationInMinutes;
        const start2 = item.startHour * 60;
        const end2 = item.startHour * 60 + item.durationInMinutes;
        if (end1 > start2 && start1 < end2) {
          overlap++;
        }
      }
    });
    const width = 95 - overlap * 10;
    const backgroundColor = `rgb(21, ${150 - overlap * 15}, ${
      227 - overlap * 30
    })`;
    return { ...event, width, backgroundColor };
  });
}

type EventCellProps = {
  event: StoredEvent;
  durationInMinutes: number;
  width?: number;
  backgroundColor?: string;
  startMin?: number;
  onEdit: (event: StoredEvent) => void;
};

const EventCell: React.FC<EventCellProps> = ({
  event,
  durationInMinutes,
  width = 95,
  backgroundColor = "var(--primary-event",
  startMin = 0,
  onEdit,
}) => (
  <div
    className="meeting"
    style={{
      height: `${durationInMinutes / minToPxRatio}px`,
      marginTop: `${startMin / minToPxRatio}px`,
      width: `${width}px`,
      backgroundColor: backgroundColor,
    }}
    onClick={() => onEdit(event)}
  >
    {`${event.startTime} - ${event.endTime} ${event.title}`}
  </div>
);
