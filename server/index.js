import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import expressSession from "express-session";
import bodyParser from "body-parser";
import connectMongo from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import passportLocal from "passport-local";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
import categoryRouter from "./routes/category.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
// console.log(`${process.env.CLIENT_URL}`);
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// const mongoSess = connectMongo(expressSession);

const sessionStorage = connectMongo.create({
  mongoUrl: process.env.MONGODB_URL,
  dbName: process.env.DB_NAME,
  collectionName: "sessions",
  ttl: 14 * 24 * 60 * 60,
  autoRemove: "native",
});

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  await User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const sessionStorage = new mongoSess({
//   uri: process.env.MONGO_URL,
//   collection: "sess",
// });

// app.use(cookieParser());

app.use(
  expressSession({
    name: "jwt",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
    },
    store: sessionStorage,
  })
);

app.use(passport.initialize());
// app.use(passport.session());

const isAuthenticated = (req, res, next) => {
  // const isV = req.isAuthenticated();
  console.log(req.session.id);
  console.log(req.session);

  if (req.session.isAuth) {
    next();
  } else {
    res.status(403).json({ message: "Please get logged in!" });
  }
};

app.use("/auth", authRouter);
app.use("/posts", isAuthenticated, postRouter);
app.use("/categories", isAuthenticated, categoryRouter);

app.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;

    var user = await User.findById(userId);
    console.log(user);

    user = user.toObject();
    delete user.password;

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

console.log(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);

mongoose
  .connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async (e) => {
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
