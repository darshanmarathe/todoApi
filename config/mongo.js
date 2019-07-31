var MongoClient = require("mongodb").MongoClient;
var _ = require("lodash");

var url = 'mongodb://localhost:27017/Todos';

module.exports = function(callback){
  MongoClient.connect(url, function(err, db){
    if(err) return callback(err, db);
    else {
      db.collection('Todos').createIndex({
              owner: 1}, { unique: false }, function(err, result){
                if(err) return callback(err, result);
                else {
                  callback(err,db);
                }
              });
    
    };
  })
}
