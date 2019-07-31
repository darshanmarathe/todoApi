const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const password = require("../helper/password.js");
const ObjectId = require('mongodb').ObjectID;
const userValidator = require('../validator/user.js');

module.exports = function(db){
  return {
    addUser : function(req, res){
      req.checkBody(userValidator);
      if(!req.validateAndRespond()) return;
      let userData = req.body.user;

      password.hashPassword(userData.password, function(_password){
        console.log(_password);
        userData.password = _password;
        db.collection('users').insertOne( userData , function(err, result){
          console.log(err);
          if(err) { 
            return res.send({
              err: true,
              error: err
            }); 
          }
          else {
            res.send({
              err: false,
              result: result
            });
          }
        });
      });
    },
    getUser : function(req, res) {
      req.checkParams('id', 'id must exist').notEmpty();
      if(!req.validateAndRespond()) return;
      var id = req.params.id;
      db.collection('users').findOne({ _id: new ObjectId(id) }, { password: 0, _id: 0 }, function(err, result){
        if(result === null) {
          return res.send({
            err: true,
            error: "user not found with given id"
          });
        } else{
          res.send({
            err: false,
            result: {
              user: result
            }
          });
        }
      });
    },
    userLogin: function(req, res) {
      req.checkBody({
        'user.password': {
          notEmpty: true
        },
        'user.email': {
          notEmpty: true
        }
      });
      if(!req.validateAndRespond()) return;
      var email = req.body.user.email;
      db.collection('users').findOne({ email: email }, function(err, user){
        if(user === null) {
          return res.send({
            err: true,
            error: ["email doesn't exist"]
          });
        }
        else {
          bcrypt.compare(req.body.user.password, user.password, function (err, result) {
            console.log("Bcrypt returns: " + result);
            if (err) {
              res.status(501).json({
                err: false,
                error: ["Server error"]
              });
            } else {
              if (result) {
                let _token = user.email + user.password ;
                user.token = jwt.sign(_token, "SuperKeyyyy");
                const id = user._id;
                db.collection('users').updateOne({ _id: ObjectId(id) }
                , { $set: user }, function (error, _user) {
                    if (error) {
                        return res.send({
                            err: true,
                            error: error
                        });
                    }
                    return res.send({   
                        err: false,
                        result: {token : user.token}
                    });
                });

              } else {
                res.status(401).json({
                  err: true,
                  error: ["Invalid email/password combination"]
                });
              }
            }
          });
        }
      });
    },
      ChangePassword: function (req, res) {
            if (!req.validateAndRespond()) return;
            var id = req.params.id;
           
            var otp = req.body.otp;
            var Newpassword = req.body.password;
            var conf_password = req.body.confPassword;
            if(Newpassword !== conf_password){
                  return res.send({
                        err: true,
                        error: "Password and confirm password do not match."
                    });
                
            }
            db.collection('users').findOne({  _id: new ObjectId(id) , otp: otp }, function (err, result) {
                if (result == null) {
                    return res.send({
                        err: true,
                        error: "Invalid OTP Presented.Please try again"
                    });
                } else {
                    password.hashPassword(Newpassword, function (_password) {

                        db.collection('users').update({ _id: new ObjectId(id) }, { $set: { "password": _password } }, function (err, result) {
                            if (err) {
                                return res.send({
                                    err: true,
                                    error: err
                                });
                            } else {
                                return res.send({
                                    err: false,
                                    result: result
                                });
                            }
                        });
                    });

                }
            });
        }
  };
};
