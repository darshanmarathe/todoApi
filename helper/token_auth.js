
function checkHeader(req) {
    var bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
      req.token = bearerHeader;
      return req;
    } else {
      return null;
    }
  }
  
  module.exports = function(db, collection) {
    return {
      ensureAuthentication : function (req, res, next) {
        req = checkHeader(req);
        if (req === null) {
          return res.status(403).send({
            result: false,
            err: "Token not set"
          });
        }
        console.log(req.token);
        db.collection(collection).findOne({ token: req.token }, function(err,result)  {
          console.log(result);
          if(err){
            return res.status(500).send({
              result: false,
              err:err 
            });
          }
          if(result){
            req.user = result;
            next();
          } else {
            res.status(401).json({
              result: false,
              err: "Invalid token"
            });
          }
        });
      },
      accessingSelf: function(req, res, next){
        var upin = req.params.upin;
        if( upin == req.user.upin ){
          next();
        }else{
          return res.send({
            err: true,
            error: "This upin belongs to someone else."
          });
        }
      }
    };
  };
  