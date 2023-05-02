const app = (req, res) => res.render('app');
const badPage = (req, res) => res.render("badPage");

module.exports.app = app;
module.exports.badPage = badPage;
module.exports.account = require('./account.js');
module.exports.timeline = require('./timeline.js');
