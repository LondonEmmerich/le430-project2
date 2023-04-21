//for front-end stuff, behind the scenes stuff goes in controller file

const React = require("react");
const ReactDOM = require("react-dom");
const helper = require("./helper.js");

const handleEvent = () => {
  return;
};

const newTimeline = async (name) => {
  let timelines = document.querySelector("#curTimeline");
  timelines.innerHTML = "<option value='timeline0'>timeline0</option>";
  let data;
  let docs;
  if(name !== ""){
    let post = await fetch("/newTimeline", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(name),
    });
  }
  let response = await fetch("/getTimelines");
  data = await response.json();
  docs = data.timelines;

  if(docs){
    console.log(docs);
    console.log(docs.length);
    for(let i = 0; i < docs.length; i++){
      timelines.innerHTML += `<option value=${docs[i].name}>${docs[i].name}</option>`;
    }
  }
};

const TimelineForm = (props) => {
  return (
    <div>
      <label>New Timeline:</label>
      <input type="text" id="newTimeline"></input>
      <button id="newTimelineBtn">
        Create
      </button>
    </div>
  );
};

const EventForm = (props) => {
  return (
    <form
    name="eventForm"
    onSubmit={handleEvent}
    action="/newEvent"
    method="POST"
    className="eventForm">
      <div id="titleDiv">
          <label>Timeline:</label>
          <select id="curTimeline">
            <option value="timeline0">timeline0</option>
          </select>
      </div>
      <div id="eventDiv">
          <label>Event:</label>
          <input type="text" id="event"></input>
      </div>
      <div id="dateDiv">
          <label>Start:</label>
          <select id="startYear">
            <option value="0">0</option>
          </select>
          <label>End:</label>
          <input type="date" id="end"></input>
      </div>
      <div id="buttons">
          <input className="makeEvent" type="submit" value="Make Event"></input>
      </div>
    </form>
    
  );
};

const init = () => {
  ReactDOM.render(<TimelineForm />, document.getElementById('timeline'));
  ReactDOM.render(<EventForm />, document.getElementById('form'));

  let timelineBtn = document.querySelector("#newTimelineBtn");
  timelineBtn.addEventListener("click", () => {
    let name = document.querySelector("#newTimeline").value;
    if(name !== ""){
      newTimeline({name});
      document.querySelector("#newTimeline").value = "";
    }
  });

  newTimeline("");
};

window.onload = init;