import saveEvent from "../../api/saveAndEditEvent";
import deleteEvent from "../../api/deleteEvent";
import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent, useEffect, useState } from "react";
import { StoredEvent } from "../../utils/types";
import { removeEvent } from "../../features/eventDisplay";
import { useEventContext } from "../../utils/EventContext";
import { RootState } from "../../store";

const eventForm: StoredEvent = {
  id: 0,
  title: "",
  startTime: "",
  startDate: "",
  endTime: "",
  endDate: "",
  guests: "",
  location: "",
  description: "",
  eventKey: "",
};

function Event({ initialEvent }: { initialEvent?: StoredEvent | null }) {
  const { selectedEventId, setSelectedEventId } = useEventContext();
  const isEventWindowOpen = selectedEventId !== null;
  const dispatch = useDispatch();
  const [form, setForm] = useState<StoredEvent>(eventForm);

  useEffect(() => {
    if (initialEvent) {
      setEndDateField(true);
      setForm({ ...initialEvent });
    } else {
      setForm(eventForm);
    }
  }, [initialEvent]);
  const [isEndDateField, setEndDateField] = useState(false);
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
    <div id="event" tabIndex={-1} className="eventContainer" role="dialog">
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
          onClick={async () => {
            if (!initialEvent) {
              return;
            } else {
              const result = await deleteEvent(initialEvent, initialEvent.id);
              if (result.success) {
                dispatch(removeEvent(initialEvent));
                setSelectedEventId(null);
              } else {
                console.error(result.error);
              }
            }
          }}
        >
          <img src="./media/delete.svg" alt="Delete event" />
        </button>
        <button
          id="dialogCloseButton"
          className="iconButton"
          onClick={() => setSelectedEventId(null)}
        >
          <img src="./media/close.svg" alt="Close the event creation menu" />
        </button>
      </div>
      {/*Title input*/}
      <div className="gap"></div>
      <div className="inputFieldDiv">
        <input
          autoFocus
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
          data-testid="startDate"
          id="startDate"
          value={form.startDate}
          onChange={(event) => handleChange(event, "startDate")}
        />
        <input
          className="datepickerInput"
          type="time"
          data-testid="startTime"
          id="startTime"
          value={form.startTime}
          onChange={(event) => handleChange(event, "startTime")}
        />
        <p className="datepickerDash">-</p>
        <input
          className="datepickerInput"
          type="time"
          data-testid="endTime"
          id="endTime"
          value={form.endTime}
          onChange={(event) => handleChange(event, "endTime")}
        />
        {isEndDateField && (
          <input
            className="datepickerInput"
            type="date"
            data-testid="endDate"
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
        data-testid="guestsField"
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
        data-testid="locationField"
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
        data-testid="descriptionField"
        className="eventOtherInput"
        placeholder="Add description"
        value={form.description}
        onChange={(event) => handleChange(event, "description")}
      />
      <div className="gap"></div>
      <button
        id="eventSaveButton"
        className="eventSaveButton"
        data-testid="eventSaveButton"
        onClick={async () => {
          const result = await saveEvent(form, form.id);
          if (result.success) {
            setSelectedEventId(null);
          }
        }}
      >
        Save
      </button>
    </div>
  );
}
export default Event;
