var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressHbs = require("express-handlebars");
var indexRouter = require("./routes/index");
var mongoose = require("mongoose");
const session = require("express-session");
const csrf = require("csurf");
const passport = require("passport");
const bcrypt = require("bcrypt-nodejs");
const flash = require("connect-flash");
const expressValidator = require("express-validator");
// var usersRouter = require('./routes/users');

function connectDatabase() {
    mongoose
        .connect("mongodb://0.0.0.0:27017/Shopping_Appliacation")
        .then(() => {
            console.log("Database Connected");
        })
        .catch((err) => {
            console.log("Error in connecting to Database");
        });
}

connectDatabase();
require("./config/passport");

var app = express();

// view engine setup
app.engine(
    ".hbs",
    expressHbs.engine({
        defaultLayout: "layout",
        extname: ".hbs",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowedProtoMethodsByDefault: true,
        },
    })
);
app.set("view engine", ".hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.set("views", __dirname + "/views");

app.use("/", indexRouter);
// app.use(
//     session({
//         secret: "vbs",
//         saveUninitialized: true,
//         resave: false,
//         cookie: { secure: false },
//     })
// );
// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

// app.use(passport.initialize());
// app.use(passport.session());

// // Validator and flash middleware

// app.use(flash());
// // app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;