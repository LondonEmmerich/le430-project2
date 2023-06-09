// import the controller folder (automatically calls the index.js file)
const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/app', mid.requiresLogin, controllers.app);

  app.get('/getTimelines', mid.requiresLogin, controllers.timeline.getTimelines);
  app.post('/newTimeline', mid.requiresLogin, controllers.timeline.addTimeline);
  app.get('/getEvents', mid.requiresLogin, controllers.timeline.getEvents);
  app.post('/newEvent', mid.requiresLogin, controllers.timeline.newEvent);

  app.post("/changePassword", mid.requiresLogin, mid.requiresSecure, controllers.account.changePassword);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.account.signup);

  app.get('/logout', mid.requiresLogin, controllers.account.logout);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.account.loginPage);

  app.get('/*', controllers.badPage);
};

module.exports = router;
