import saveEvent from "../../api/saveEvent";
import deleteEvent from "../../api/deleteEvent";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ChangeEvent, useEffect, useState } from "react";
import { StoredEvent } from "../../utils/types";

export class Form implements StoredEvent {
  id = 0;
  title = "";
  startTime = "";
  startDate = "";
  endTime = "";
  endDate = "";
  guests? = "";
  location? = "";
  description? = "";
  [key: string]: string | number | undefined;
}

// triggerEventWindow: (value: boolean | ((prevVar: boolean) => boolean)) => void;

function Event({
  eventWindow,
  triggerEventWindow,
  initialEvent,
}: {
  eventWindow: boolean;
  triggerEventWindow: (value: boolean) => void;
  initialEvent?: StoredEvent;
}) {
  const [form, setForm] = useState<Form>(
    initialEvent ? { ...initialEvent } : new Form()
  );

  const [isEndDateField, setEndDateField] = useState(false);
  const currentDateStr = useSelector(
    (state: RootState) => state.currentDate.currentDate
  );
  function handleShowEndDate() {
    const areTimesEntered = form.startTime !== "" && form.endTime !== "";
    const isEventEndAfterStart =
      form.endTime < form.startTime &&
      (form.startDate < form.endDate || form.endDate === "");

    const isEndDateNeeded =
      form.endDate === "" && form.startTime < form.endTime;
    if (areTimesEntered && isEventEndAfterStart) {
      setEndDateField(true);
    } else if (
      areTimesEntered &&
      !isEndDateNeeded &&
      isEndDateField &&
      form.endDate === ""
    ) {
      setEndDateField(false);
    } else if (form.endDate === "") {
      setEndDateField(false);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>, fieldType: string) {
    setForm({
      ...form,
      [fieldType]: e.target.value,
    });
  }
  useEffect(() => {
    handleShowEndDate();
  }, [form.startTime, form.endTime]);
  return (
    <div id="event" tabIndex={-1} className="eventContainer">
      {/*Header row*/}
      <img
        className="iconButton"
        src="./media/drag.svg"
        alt="Drag the event creation menu"
      />
      <div className="alignedRight">
        <button
          id="deleteEventButton"
          className="iconButton"
          onClick={() => {
            triggerEventWindow(!eventWindow);
            deleteEvent(currentDateStr);
          }}
        >
          <img src="./media/delete.svg" alt="Delete event" />
        </button>
        <button
          id="dialogCloseButton"
          className="iconButton"
          onClick={() => triggerEventWindow(!eventWindow)}
        >
          <img src="./media/close.svg" alt="Close the event creation menu" />
        </button>
      </div>
      {/*Title input*/}
      <div className="gap"></div>
      <div className="inputFieldDiv">
        <input
          id="title"
          type="text"
          className="eventNameInput"
          placeholder="Add title"
          value={form.title}
          onChange={(event) => handleChange(event, "title")}
        />
      </div>
      {/*Event type row*/}
      <div className="gap"></div>
      <div className="eventTypeLine">
        <p className="eventTypeBoxSelected">Event</p>
        <p className="eventTypeBox">Task</p>
        <p className="eventTypeBox">Out of office</p>
        <p className="eventTypeBox">Focus time</p>
        <p className="eventTypeBox">Working location</p>
        <p className="eventTypeBox">Appointment schedule</p>
      </div>
      {/*Datepicker row*/}
      <img className="icon" src="./media/schedule_watch.svg" alt="Watch icon" />
      <div className="eventTimePickerContainer">
        <input
          className="datepickerInput"
          type="date"
          id="startDate"
          value={form.startDate}
          onChange={(event) => handleChange(event, "startDate")}
        />
        <input
          className="datepickerInput"
          type="time"
          id="startTime"
          value={form.startTime}
          onChange={(event) => handleChange(event, "startTime")}
        />
        <p className="datepickerDash">-</p>
        <input
          className="datepickerInput"
          type="time"
          id="endTime"
          value={form.endTime}
          onChange={(event) => handleChange(event, "endTime")}
        />
        {isEndDateField && (
          <input
            className="datepickerInput"
            type="date"
            id="endDate"
            value={!isEndDateField ? "" : form.endDate}
            onChange={(event) => handleChange(event, "endDate")}
          />
        )}
      </div>
      {/*Guests row*/}
      <img className="icon" src="./media/contacts.svg" alt="Add guests" />
      <input
        id="guests"
        type="text"
        className="eventOtherInput"
        placeholder="Add guests"
        value={form.guests}
        onChange={(event) => handleChange(event, "guests")}
      />
      {/*Location row*/}
      <img className="icon" src="./media/location.svg" alt="Add a location" />
      <input
        id="location"
        type="text"
        className="eventOtherInput"
        placeholder="Add location"
        value={form.location}
        onChange={(event) => handleChange(event, "location")}
      />
      {/*Description row*/}
      <img className="icon" src="./media/notes.svg" alt="Add a description" />
      <input
        id="description"
        type="text"
        className="eventOtherInput"
        placeholder="Add description"
        value={form.description}
        onChange={(event) => handleChange(event, "description")}
      />
      <div className="gap"></div>
      <button
        id="eventSaveButton"
        className="eventSaveButton"
        onClick={() => saveEvent(currentDateStr, form)}
      >
        Save
      </button>
    </div>
  );
}
export default Event;
