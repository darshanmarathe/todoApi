/**
 * Module dependencies.
 */

const bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  expressValidator = require("express-validator"),
  winston = require("winston"),
  expressWinston = require('express-winston');
  // eslint-disable-next-line no-undef
  env = process.env.NODE_ENV || "development",
  _ = require("lodash");

  

/**
 * Expose
 */

module.exports = function(app) {
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
   }));
  // bodyParser should be above methodOverride
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );

  app.use(
    bodyParser.json({
      strict: true
    })
  );
  app.use(function(error, req, res, next) {
    if (error instanceof SyntaxError) {
      //Catch json error
      res.status(400).send({
        err: true,
        error: "Invalid JSON"
      });
    } else {
      next();
    }
  });
  app.use(
    expressValidator({
      customValidators: {
        isString: function(value) {
          return typeof value === "string" || value instanceof String;
        },
        isArray: function(value){
          return typeof value === "Array" || value instanceof Array;
        }
      }
    })
  );

  app.use(function(req, res, next) {
    req.validateAndRespond = function() {
      let errors = req.validationErrors();
      errors = _.uniqBy(errors, "param");
      if (errors.length) {
        res.status(400).send({ err: true, error: errors });
        return false;
      } else return true;
    };
    next();
  });
  app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,Content-Type, Authorization, Accept"
    );
    next();
  });
  app.use(
    methodOverride(function(req) {
      if (req.body && typeof req.body === "object" && "_method" in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
    })
  );
};
