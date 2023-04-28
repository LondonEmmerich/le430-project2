//for front-end stuff, behind the scenes stuff goes in controller file

const React = require("react");
const ReactDOM = require("react-dom");
const helper = require("./helper.js");

const getEarliest = (docs) => {
  let date = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < docs.length; i += 1) {
    const eventStart = docs[i].startDate;
    if (date > eventStart) {
      date = eventStart;
    }
  }

  return date;
};

const getLatest = (docs) => {
  let date = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < docs.length; i += 1) {
    const eventEnd = docs[i].endDate;
    if (date < eventEnd) {
      date = eventEnd;
    }
  }

  return date;
};

const intToDate = (num) => {
  let date = "";
  let month = num % 12;
  if(month === 0){
    month = 12;
  }
  num -= month;
  let year = num / 12;
  date = `${month}/${year}`;
  return date;
}

const getEvents = async () => {

  console.log("Get Events");
  let app = document.querySelector("#app");
  app.innerHTML = "";
  let docs;

  //get all the events
  let response = await fetch(`/getEvents?timeline=${document.querySelector("#curTimeline").value}`);
  console.log(response);
  if(response){
    let data = await response.json();
    console.log(`Data: ${data}`);
    docs = data.events;
  }
  console.log(`Docs: ${docs}`);

  //if there are any timelines
  if(docs.length !== 0){
    /*app.innerHTML += "<ul>";
    //add them to the dropdown
    for(let i = 0; i < docs.length; i++){
      app.innerHTML += `<li>${docs[i].name}, ${docs[i].startDate}, ${docs[i].endDate}</li>`;
    }
    app.innerHTML += "</ul>";*/


    //get the base params
    const numCells = 11;
    let start = getEarliest(docs);
    let end = getLatest(docs);
    let length = end - start;
    //the cellAmt is the amount to increase each cell
    let cellAmt = length / numCells;
    let table = "<table>";

    //for each event
    for(let i = 0; i < docs.length; i++){
        table += `<tr><td>${docs[i].name}</td>`;
        let val = start;
        //if the cell is between the start and end, 
        //with leeway for being inbetween cells,
        //color it in
        for(let cell = 1; cell <= numCells + 1; cell++){
            if(docs[i].start <= val + cellAmt && docs[i].end >= val - cellAmt){
                table += `<td class="filled"></td>`;
            }
            else{
                table += `<td class="empty"></td>`;
            }
            //increase the value
            val = val + cellAmt;
        }
        table += `</tr>`;
    }
    //fill in the timeline at the bottom of the table
    table += `<tr><td></td>`;
    let val = start;
    for(let i = 0; i < numCells + 1; i++){
        //convert the value back into a date to put it on the timeline
        let output = Math.round(val);
        table += `<td class="timeline">${intToDate(output)}</td>`;
        val = val + cellAmt;
    }
    table += `</table>`;
    app.innerHTML = table;
  }
  else{
    app.innerHTML = "<p>No Events for this timeline</p>";
  }
}

const handleEvent = async (e) => {
  e.preventDefault();

  //get the event's name
  const name = e.target.querySelector("#event").value;

  //get the dates
  let startYear = parseInt(e.target.querySelector("#startYear").value);
  let endYear = parseInt(e.target.querySelector("#endYear").value);

  //make sure the years are valid numbers
  if(!Number.isInteger(startYear) || !Number.isInteger(endYear)){
    helper.handleError("The years must be whole numbers");
    return false;
  }

  let startDate = (startYear * 12) + parseInt(e.target.querySelector("#startMonth").value);
  let endDate = (endYear * 12) + parseInt(e.target.querySelector("#endMonth").value);
  //make sure that the start is before the end
  if(startDate > endDate){
    let tempDate = startDate;
    startDate = endDate;
    endDate = tempDate;
  }

  //get the selected timeline
  const timeline = e.target.querySelector("#curTimeline").value;

  //ensure that all elements are present
  if(!name || !startDate || !endDate || !timeline){
      helper.handleError("All fields are required!");
      return false;
  }

  //if the event exists
  if(name !== ""){
    //post the new event
    let post = await fetch("/newEvent", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, startDate, endDate, timeline}),
    });
  }

  //empty the fields
  e.target.querySelector("#event").value = "";
  e.target.querySelector("#startYear").value = "";
  e.target.querySelector("#startMonth").value = 1;
  e.target.querySelector("#endYear").value = "";
  e.target.querySelector("#endMonth").value = 1;

  getEvents();

  return false;
};

//adds a new timeline to the database and displays it on the dropdown
const newTimeline = async (name) => {
  //reset the dropdown
  let timelines = document.querySelector("#curTimeline");
  timelines.innerHTML = "<option value='timeline0'>timeline0</option>";
  let data;
  let docs;

  //if the name exists
  if(name !== ""){
    //post the new timeline
    let post = await fetch("/newTimeline", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(name),
    });
  }

  //get all the timelines
  let response = await fetch("/getTimelines");
  data = await response.json();
  docs = data.timelines;

  //if there are any timelines
  if(docs){
    //add them to the dropdown
    for(let i = 0; i < docs.length; i++){
      timelines.innerHTML += `<option value=${docs[i].name}>${docs[i].name}</option>`;
    }
  }
};

//button and textfield to create a new timeline
const TimelineForm = (props) => {
  return (
    <div>
      <label>New Timeline Name:</label>
      <input type="text" id="newTimeline"></input>
      <button id="newTimelineBtn">
        Create
      </button>
    </div>
  );
};

//form to add a new event
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
          <input type="text" id="startYear" placeholder="Year"></input>
          <select id="startMonth">
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <label>End:</label>
          <input type="text" id="endYear" placeholder="Year"></input>
          <select id="endMonth">
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
      </div>
      <div id="buttons">
          <input className="makeEvent" type="submit" value="Make Event"></input>
      </div>
    </form>
    
  );
};

const init = () => {
  //add the two forms to the page
  ReactDOM.render(<TimelineForm />, document.getElementById('timeline'));
  ReactDOM.render(<EventForm />, document.getElementById('form'));

  //set up the new timeline creator
  let timelineBtn = document.querySelector("#newTimelineBtn");
  timelineBtn.addEventListener("click", () => {
    let name = document.querySelector("#newTimeline").value;
    if(name !== ""){
      newTimeline({name});
      document.querySelector("#newTimeline").value = "";
    }
  });

  let curTimeline = document.querySelector("#curTimeline");
  curTimeline.addEventListener("change", getEvents);

  //get all the pre-existing timelines for that user
  newTimeline("");

  getEvents();
};

window.onload = init;