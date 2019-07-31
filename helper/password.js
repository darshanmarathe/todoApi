var bcrypt = require("bcryptjs");


exports.hashPassword = function(password, cb) {
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            console.log(err);
            cb(null);
        } else {
            console.log(hash);
            cb(hash);
        }
    });
};
