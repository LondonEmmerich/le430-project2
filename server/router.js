// import the controller folder (automatically calls the index.js file)
const controllers = require('./controllers');

const router = (app) => {
  app.get('/app', controllers.app);
  app.get("/login", controllers.login);
  app.get('/', controllers.app);
};

module.exports = router;
