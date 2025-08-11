import { eventViewTrigger } from "../utils/handleEventForm";
import saveEvent from "../utils/saveEvent";
import deleteEvent from "../utils/deleteEvent";

function Event() {
  function handleShowEndDate() {
    const endTime = document.getElementById("endTime") as HTMLInputElement;
    const startTime = document.getElementById("startTime") as HTMLInputElement;
    const endDate = document.getElementById("endDate") as HTMLInputElement;
    const startDate = document.getElementById("startDate") as HTMLInputElement;

    const areDatesEntered = startTime.value !== "" && endTime.value !== "";
    const isEventEndAfterStart =
      endTime.value < startTime.value && startDate.value > endDate.value;
    const isEndDateNeeded =
      endDate.value === "" && startTime.value > endDate.value;

    if (areDatesEntered && isEventEndAfterStart) {
      endDate?.classList.toggle("notDisplayed");
    } else if (
      !endDate?.classList.contains("notDisplayed") &&
      isEndDateNeeded
    ) {
      endDate?.classList.toggle("notDisplayed");
      endDate.value = "";
    }
  }
  return (
    <div id="event" tabIndex={-1} className="eventContainer notDisplayed">
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
          onClick={() => deleteEvent(new Date())}
        >
          <img src="./media/delete.svg" alt="Delete event" />
        </button>
        <button
          id="dialogCloseButton"
          className="iconButton"
          onClick={() => eventViewTrigger()}
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
        <input className="datepickerInput" type="date" id="startDate" />
        <input
          className="datepickerInput"
          type="time"
          id="startTime"
          onChange={handleShowEndDate}
        />
        <p className="datepickerDash">-</p>
        <input
          className="datepickerInput"
          type="time"
          id="endTime"
          onChange={handleShowEndDate}
        />
        <input
          className="datepickerInput notDisplayed"
          type="date"
          id="endDate"
        />
      </div>
      {/*Guests row*/}
      <img className="icon" src="./media/contacts.svg" alt="Add guests" />
      <input
        id="guests"
        type="text"
        className="eventOtherInput"
        placeholder="Add guests"
      />
      {/*Location row*/}
      <img className="icon" src="./media/location.svg" alt="Add a location" />
      <input
        id="location"
        type="text"
        className="eventOtherInput"
        placeholder="Add location"
      />
      {/*Description row*/}
      <img className="icon" src="./media/notes.svg" alt="Add a description" />
      <input
        id="description"
        type="text"
        className="eventOtherInput"
        placeholder="Add description"
      />
      <div className="gap"></div>
      <button
        id="eventSaveButton"
        className="eventSaveButton"
        onClick={() => saveEvent(new Date())}
      >
        Save
      </button>
    </div>
  );
}
export default Event;
