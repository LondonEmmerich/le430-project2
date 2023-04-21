const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

/* Our schema defines the data we will store. A username (string of alphanumeric
   characters), the account, the timeline, the start and end dates, and the created date.
*/
const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  timeline: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  startDate: {
    type: Number,
    required: true,
  },
  endDate: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account'
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts a doc to something we can store in redis later on.
EventSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  timeline: doc.timeline,
  startDate: doc.startDate,
  endDate: doc.endDate
});

const EventModel = mongoose.model('Event', EventSchema);
module.exports = EventModel;