// import the controller folder (automatically calls the index.js file)
const controllers = require('./controllers');

const router = (app) => {
  app.get('/example1', controllers.example1);
  app.get('/example2', controllers.example2);
  app.get('/example3', controllers.example3);
  app.get('/getSongs', controllers.getSongs);
  app.get('/', controllers.example1);
};

module.exports = router;
