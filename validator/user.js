module.exports = {
    "user.email": {
      notEmpty: true,
      isEmail: true
    },
    "user.password": {
      notEmpty: true,
      isString: true
    },
    "user.name":{
      isString: true,
      notEmpty: false
    }
  };
    
    
   
  