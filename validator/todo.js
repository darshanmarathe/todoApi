module.exports = {
    'todo.title':{
      isString: true,
      notEmpty: true
    },
    'todo.description':{
        isString: true,
        notEmpty: true
    },
    'todo.isCompleted':{
        isBoolean: true,
        notEmpty: true
    },
    'todo.owner' : {
      isArray : true,
      notEmpty : true
    }
  }
  