import { Router } from "express";
import User, { UserSchema } from "../models/User.js";
import bcrypt from "bcrypt";
import passport from "passport";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const body = req.body;
    const email = body["email"];
    const password = body["password"];

    console.log(req.session.id);
    console.log(req.session);

    var u = await User.findOne({ email: email });

    console.log(u);

    if (!u) {
      return res.status(403).json({ message: "User does not exist!" });
    }

    const isPassMatch = await bcrypt.compare(password, u.password);
    if (!isPassMatch) {
      return res.status(403).json({ message: "Invalid Credentials!" });
    }

    u = u.toObject();

    delete u.password;

    req.session.isAuth = true;
    req.session.userId = u._id;

    return res.status(200).json({ user: u });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    // req.session.isAuth = false;
    // req.session.userId = "";

    req.logout(function (err) {
      if (err) {
        return res.status(500).json({ message: "Something went wrong!" });
      }
      // console.log("Deleting!");
      req.session.destroy(function (err) {
        if (err) {
          return res.status(500).json({ message: "Something went wrong!" });
        }
        // console.log("Deleting 1!");
        // res.cookie("jwt", "");

        res.status(200).json({ message: "Logged out!" }); //Inside a callback… bulletproof!
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const body = req.body;
    const username = body["username"];
    const email = body["email"];
    const password = body["password"];

    let user = new User();
    user.username = username;
    user.email = email;
    user.password = password;

    await user.save();

    console.log(req.session);

    user = user.toObject();

    delete user.password;

    req.session.isAuth = true;
    req.session.userId = user._id;

    res.status(201).json(user);
  } catch (error) {
    console.log(error.message);
    if (error.code == 11000) {
      res.status(403).json({ message: "Duplicate key already exists!" });
    } else {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
});

export default router;
