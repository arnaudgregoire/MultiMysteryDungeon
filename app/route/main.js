const passport = require("passport");
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config/config.json");

const router = express.Router();
const TOKENS = {};

router.get("/status", (req, res, next) => {
  res.status(200).json({ status: "ok" });
});

router.post("/signup", passport.authenticate("signup", { session: true }), async (req, res, next) => {
  res.status(200).json({ message: "signup successful" });
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An Error occured");
        return next(error);
      }
      req.login(user, { session: true }, async (error) => {
        if (error) return next(error);
        const body = {
          _id: user._id,
          email: user.email,
          name: user.name
        };

        const token = jwt.sign({ user: body }, config.PUBLIC_KEY, { expiresIn: 300 });
        const refreshToken = jwt.sign({ user: body }, config.PUBLIC_KEY, { expiresIn: 86400 });

        // store tokens in cookie
        res.cookie("jwt", token);
        res.cookie("refreshJwt", refreshToken);

        // store tokens in memory
        TOKENS[refreshToken] = {
          token,
          refreshToken,
          email: user.email,
          _id: user._id,
          name: user.name
        };

        //Send back the token to the user
        return res.status(200).json({ token, refreshToken });
      });
    }
    catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post("/token", (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken in TOKENS) {
    const body = { email: TOKENS[refreshToken].email, _id: TOKENS[refreshToken]._id, name: TOKENS[refreshToken].name };
    const token = jwt.sign({ user: body }, config.PUBLIC_KEY, { expiresIn: 300 });
    // update jwt
    res.cookie("jwt", token);
    TOKENS[refreshToken].token = token;

    res.status(200).json({ token });
  }
  else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.post("/logout", (req, res) => {
  if (req.cookies) {
    const refreshToken = req.cookies["refreshJwt"];
    if (refreshToken in TOKENS) delete TOKENS[refreshToken]
    res.clearCookie("refreshJwt");
    res.clearCookie("jwt");
  }

  res.status(200).json({ message: "logged out" });
});

module.exports = router;
