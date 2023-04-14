const app = (req, res) => {
  return res.render('app');
};

const login = (req, res) => {
  return res.render('login');
};

module.exports.app = app;
module.exports.login = login;

