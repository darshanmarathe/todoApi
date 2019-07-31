module.exports = function (db, app) {
    //User Controllers

    const user = require('../controller/users.js')(db);

    app.get('/user/:id', user.getUser);
    app.post('/user', user.addUser);
    app.post('/user/login', user.userLogin);
    app.post('/user/:id/Changepassword', user.ChangePassword);


}
