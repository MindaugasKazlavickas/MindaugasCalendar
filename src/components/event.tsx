function Event() {
  return (
    <div id="event" tabIndex={-1} className="eventContainer notDisplayed">
      {/*Header row*/}
      <img
        className="iconButton"
        src="./media/drag.svg"
        alt="Drag the event creation menu"
      />
      <div className="alignedRight">
        <button id="deleteEventButton" className="iconButton">
          <img src="./media/delete.svg" alt="Delete event" />
        </button>
        <button id="dialogCloseButton" className="iconButton">
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
        <input type="date" id="startDate" />
        <input type="time" id="startTime" />
        <input type="time" id="endTime" />
        <input type="date" id="endDate" />
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
      <button id="eventSaveButton" className="eventSaveButton">
        Save
      </button>
    </div>
  );
}
export default Event;
