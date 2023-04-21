const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

/* Our schema defines the data we will store. A name, owner, and the created date.
*/
const TimelineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts a doc to something we can store in redis later on.
TimelineSchema.statics.toAPI = (doc) => ({
  name: doc.name,
});

const TimelineModel = mongoose.model('Timeline', TimelineSchema);
module.exports = TimelineModel;
