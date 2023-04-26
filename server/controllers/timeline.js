// for behind the scenes stuff, front-end stuff goes in jsx file
const models = require('../models');

const { Timeline, Event } = models;

// add a timeline to the database
const addTimeline = (req, res) => {
  // if the timeline doesn't exist, exit
  if (!req.body.name) {
    return res.status(400).json({ error: 'The timeline needs a name!' });
  }

  // store the timeline's data
  const timelineData = {
    name: req.body.name,
    owner: req.session.account._id,
  };

  // store the timeline in the database
  try {
    const newTimeline = new Timeline(timelineData);
    newTimeline.save();
    return res.status(201).json({ name: newTimeline.name });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Timeline already exists!' });
    }
    return res.status(500).json({ error: 'An error occured adding timeline!' });
  }
};

// get all the timelines for a particular user
const getTimelines = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Timeline.find(query).select('name').lean().exec();

    return res.json({ timelines: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving timelines!' });
  }
};

const newEvent = (req, res) => {
  // if the event doesn't exist, exit
  if (!req.body.name || !req.body.startDate || !req.body.endDate || !req.body.timeline) {
    return res.status(400).json({ error: 'The event needs a name and dates!' });
  }

  // store the event's data
  const eventData = {
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    timeline: req.body.timeline,
    owner: req.session.account._id,
  };

  // store the event in the database
  try {
    const newEventDoc = new Event(eventData);
    newEventDoc.save();
    return res.status(201).json({ name: newEventDoc.name });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Event already exists!' });
    }
    return res.status(500).json({ error: 'An error occured adding event!' });
  }
};

const getEvents = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Event.find(query).select('name startDate endDate timeline').lean().exec();
    let trimmedDocs = [];

    console.log(req.query.timeline);

    for(let i = 0; i < docs.length; i++){
        if(docs[i].timeline === req.query.timeline){
            trimmedDocs.push(docs[i]);
        }
    }

    return res.json({ events: trimmedDocs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving events!' });
  }
};

const page = (req, res) => res.render('app');

module.exports.addTimeline = addTimeline;
module.exports.getTimelines = getTimelines;
module.exports.newEvent = newEvent;
module.exports.getEvents = getEvents;
module.exports.page = page;
