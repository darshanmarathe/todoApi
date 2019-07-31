module.exports = function (db, app) {
    //User Controllers

    var authentication = require('../helper/token_auth.js')(db, 'users');
    
    const Todos = require('../controller/todos.js')(db);
    
    app.get('/todos/:id', authentication.ensureAuthentication, Todos.getTodoById);
    app.post('/todos', authentication.ensureAuthentication, Todos.addTodo);
    app.get('/todos/all/:owner', authentication.ensureAuthentication, Todos.getAllTodos);
    app.put('/todos', authentication.ensureAuthentication, Todos.updateTodo);
    app.delete('/todos/:id', authentication.ensureAuthentication, Todos.deleteTodo);

}
