const app = (req, res) => res.render('app');

module.exports.app = app;
module.exports.account = require('./account.js');
module.exports.timeline = require("./timeline.js");
