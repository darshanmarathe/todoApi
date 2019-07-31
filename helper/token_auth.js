const jwt = require("jsonwebtoken");
const settings = require('../config/settings')

function checkHeader(req) {
  var bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== "undefined") {
    req.token = bearerHeader;
    return req;
  } else {
    return null;
  }
}

module.exports = function(db, collection) {
  return {
    ensureAuthentication: function(req, res, next) {
      req = checkHeader(req);
      if (req === null) {
        return res.status(403).send({
          result: false,
          err: "Token not set"
        });
      }
      jwt.verify(req.token, "SuperKeyyyy", function(err, decoded) {
    
        if(!settings.useSingleDevice){
          if(err) {
            res.status(403).send({
              result: false,
              err: "Invalid Token"
            });
          }
          if(decoded){
                    req.user = {user} = decoded;
                    next();
                    return;
          }
        }else{
          db.collection(collection).findOne({ token: req.token }, function(
            err,
            result
          ) {
            console.log(result);
            if (err) {
              return res.status(500).send({
                result: false,
                err: err
              });
            }
            if (result) {
              req.user = result;
              next();
            } else {
              res.status(401).json({
                result: false,
                err: "Invalid token"
              });
            }
          });
        }
      });
    }
  };
};
