const todoValidator = require('../validator/todo.js');
const ObjectId = require('mongodb').ObjectID;

module.exports = function(db){
  return {
    getTodoById : function(req, res){
      req.check('id', 'Must exist');
      if(!req.validateAndRespond()) return;
      var id = req.params.id;
      db.collection('Todos').find({_id: new ObjectId(id)}).toArray(function(error,todo){
        if(error){
          res.send({
            err: true, 
            error: error
          });
        }else{
          todo.links = {};
          todo.links.self = `http://${req.headers.host}/todos/${todo._id}`
          todo.link.all = `http://${req.headers.host}/todos/all/${todo.owner}`
          res.send({
            err: false,
            result: todo
          });
        }
      });
    },
    addTodo : function(req, res){
      req.checkBody(todoValidator);
      if(!req.validateAndRespond()) {
       return res.status(400);

      };
      const todoJson = req.body.todo;
      if(todoJson.isCompleted == undefined) todoJson.isCompleted =false;
      db.collection('Todos').insertOne(todoJson, function(error, result){
        if(error){
          return res.send({
            err: true,
            error: error
          });
        }
        let todo  =  todoJson;
        todo.links = {};
         todo.links.self = `http://${req.headers.host}/todos/${result.insertedId}`
         todo.links.all = `http://${req.headers.host}/todos/all/${req.user.email}`
    
        return res.send({
          err: false,
          result: todo
        });
      });
    },
    updateTodo: function (req, res) {
            req.checkBody(todoValidator);
            if (!req.validateAndRespond()) return;
            var Json = req.body.todo;
            var id=  Json._id;
            delete Json._id;
            db.collection('Todos').updateOne({ _id: ObjectId(id) }
                , { $set: Json }, function (error, result) {
                    if (error) {
                        return res.send({
                            err: true,
                            error: error
                        });
                    }
                    let todo = req.body.todo;
                    todo.links = {};
                    todo.links.self = `http://${req.headers.host}/todos/${todo._id}`
                    todo.links.all = `http://${req.headers.host}/todos/all/${req.user.email}`
               
                    return res.send({   
                        err: false,
                        result: todo
                    });
                });
        },
    getAllTodos: function(req, res){
      req.check('owner', 'Must exist');
  
      const owner = req.params.owner
      db.collection('Todos').find({owner : owner }).toArray(function(error,todos){
        if(error){
          res.send({
            err: true, 
            error: error
          });
        }else{
          const returnTodos  = todos.map((todo) => {
            todo.links = {};
            todo.links.self = `http://${req.headers.host}/todos/${todo._id}`
            todo.links.all = `http://${req.headers.host}/todos/all/${todo.owner}`
            return todo;
          })
          res.send({
            err: false,
            result: returnTodos
          });
        }
      });
    },
    deleteTodo:function(req, res){
      req.check('id', 'Must exist');
      const id = req.params.id
      
      db.collection('Todos').remove({ _id: ObjectId(id) }, true, function (error) {
        if(error){
          res.send({
            err: true, 
            error: error
          });
        }else{
          res.send({
            err: false,
            result: 'deleted'
          });
        }
      });
    }
  };
};
