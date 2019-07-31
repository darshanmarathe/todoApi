const express = require("express");
const app = express();

require("./config/express.js")(app);


require("./config/mongo.js")(function(err, db){
    if(err) throw err;
    // require("./routes/patient.js")(db, app);
     require("./routes/index.js")(db, app);

});

app.listen(8080);
console.log("Application listening on port 8080");

module.exports = app;
