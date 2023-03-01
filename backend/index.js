require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const multer = require("multer");
const cors = require("cors");
//MIDDLEWARES
const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middlewares/error-handler");


const MONGODB_URI = process.env.MONGODB_URI;




const fileStorage = multer.diskStorage({
  destination: (req, File, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use("./images", express.static(path.join(__dirname, "images")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("shop", "views");

app.use(bodyParser.urlencoded({ extended: false }));



app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(flash());

//SETTING LOCAL VARIABLES
app.use((req, res, next) => {
  // req.user ? res.locals.isAuthenticated=true : res.locals.isAuthenticated=false
  res.locals.isAdmin = false;
  res.locals.isAuthenticated = false;
  if (req.user) {
    res.locals.isAuthenticated = true;
    res.locals.username = req.user.name;
    res.locals.userId = req.user._id;

    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
  }
  next();
});

//REQUIRING ROUTES
const homeRouter = require("./routes/home");
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");
app.use(flash());
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,PATCH,DELETE",
  })
);

// USING ROUTES
app.use(homeRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use(errorHandlerMiddleware);
//NOT FOUND PAGE
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

const port = process.env.PORT || 5000;

//STARTING DEV SERVER
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
