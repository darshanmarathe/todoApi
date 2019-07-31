/**
 * Module dependencies.
 */

const bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  expressValidator = require("express-validator"),
  winston = require("winston"),
  env = process.env.NODE_ENV || "development",
  _ = require("lodash");

/**
 * Expose
 */

module.exports = function(app) {
  // Use winston on production
  var log;
  if (env !== "development") {
    log = {
      stream: {
        write: function(message, encoding) {
          winston.info(message);
        }
      }
    };
  } else {
    log = "dev";
  }
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
        }
      }
    })
  );

  app.use(function(req, res, next) {
    req.validateAndRespond = function() {
      errors = req.validationErrors();
      errors = _.uniqBy(errors, "param");
      if (errors.length) {
        res.send({ err: true, error: errors });
        return false;
      } else return true;
    };
    next();
  });
  app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,Content-Type, Authorization, Accept"
    );
    next();
  });
  app.use(
    methodOverride(function(req, res) {
      if (req.body && typeof req.body === "object" && "_method" in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
    })
  );
};
