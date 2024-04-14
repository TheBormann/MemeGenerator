var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");

// ##### IMPORTANT
// ### Your backend project has to switch the MongoDB port like this
// ### Thus copy paste this block to your project
const MONGODB_PORT = process.env.DBPORT || "65535";
const db = require("monk")(`127.0.0.1:${MONGODB_PORT}/omm-ws2223`); // connect to database omm-2021
console.log(`Connected to MongoDB at port ${MONGODB_PORT}`);
// ######

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var memesRouter = require("./routes/memes");
var templatesRouter = require("./routes/templates");
var loginRouter = require("./routes/login");
var signupRouter = require("./routes/signUp");
var resetPasswordRouter = require("./routes/resetPassword");
var getUserDataRouter = require("./routes/getUserData");
var updateUserDataRouter = require("./routes/updateUserData");
var usermemesRouter = require("./routes/getUserMemes");

var bodyParser = require("body-parser");

var app = express();

// Swagger setup
var options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "meme-generator-backend API",
      version: "1.0.0",
      description: "API for the meme generator backend",
    },
  },
  servers: ["http://localhost:3001"],
  apis: ["routes/*.js", "./apps/meme-generator-backend/routes/*.js"],
};
var specs = swaggerJsdoc(options);
app.use("/api", swaggerUi.serve, swaggerUi.setup(specs));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(function (req, res, next) {
  req.db = db;
  next();
});

//TODO: Remove this in production
app.use(
  cors({
    origin: "*", // Adjust as necessary
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
    ],
  })
);

// Use static resources from "public"
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/memes", memesRouter);
app.use("/templates", templatesRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/reset-password", resetPasswordRouter);
app.use("/getUserData", getUserDataRouter);
app.use("/updateUserData", updateUserDataRouter);
app.use("/getUserMemes", usermemesRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// For production to connect to the frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

module.exports = app;
