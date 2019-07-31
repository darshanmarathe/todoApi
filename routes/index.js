module.exports = function (db, app) {
    //User Controllers

    var authentication = require('../helper/token_auth.js')(db, 'users');
  

    const user = require('../controller/users.js')(db);

    app.get('/user/:id', user.getUser);
    app.post('/user', user.addUser);
    app.post('/user/login', user.userLogin);
    app.post('/user/:id/Changepassword', user.ChangePassword);




}
