var MongoClient = require("mongodb").MongoClient;
var _ = require("lodash");

var url = 'mongodb://localhost:27017/Todos';

module.exports = function(callback){
  MongoClient.connect(url, function(err, db){
    if(err) return callback(err, db);
    else {
      db.collection('patients').createIndex({
              upin: 1}, { unique: true }, function(err, result){
                if(err) return callback(err, result);
                else {
                  callback(err,db);
                }
              });
    
    };
  })
}
