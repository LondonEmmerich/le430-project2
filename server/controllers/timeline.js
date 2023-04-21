//for behind the scenes stuff, front-end stuff goes in jsx file
const models = require("../models");
const {Timeline} = models;

const addTimeline = (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: 'The timeline needs a name!' });
      }
    
      const timelineData = {
        name: req.body.name,
        owner: req.session.account._id
      };
    
      try {
        const newTimeline = new Timeline(timelineData);
        newTimeline.save();
        return res.status(201).json({ redirect: "/getTimelines" });
      } catch (err) {
        console.log(err);
        if (err.code === 11000) {
          return res.status(400).json({ error: 'Timeline already exists!' });
        }
        return res.status(500).json({ error: 'An error occured adding timeline!' });
      }
};

const getTimelines = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Timeline.find(query).select('name').lean().exec();
    
        return res.json({ timelines: docs });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving timelines!' });
      }
}

const page = (req, res) => {
    return res.render("app");
};

module.exports.addTimeline = addTimeline;
module.exports.getTimelines = getTimelines;
module.exports.page = page;