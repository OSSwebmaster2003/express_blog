import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import authMiddleware from "../middleware/auth.js";
import { generateJwtToken } from "../services/token.js";

const router = Router();

router.get("/login", (req, res) => {
  if (req.cookies.token) {
    res.redirect("/");
    return;
  }
  res.render("login", {
    title: "Login | Otabek",
    isLogin: true,
    loginError: req.flash("loginError"),
  });
});

router.get("/register", (req, res) => {
  if (req.cookies.token) {
    res.redirect("/");
    return;
  }
  res.render("register", {
    title: "Register | Otabek",
    isRegister: true,
    registerError: req.flash("registerError"),
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("loginError", "all fields required");
    res.redirect("/login");
    return;
  }
  const existUser = await User.findOne({ email });
  if (!existUser) {
    req.flash("loginError", "User Not Found");
    res.redirect("/login");
    return;
  }
  const isPasswordEqual = await bcrypt.compare(password, existUser.password);
  if (!isPasswordEqual) {
    req.flash("loginError", "Password Wrong");
    res.redirect("/login");
    return;
  }

  const token = generateJwtToken(existUser._id);
  res.cookie("token", token, { httpOnly: true, secure: true });
  res.redirect("/");

  res.redirect("/");
});

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
  };
  if (!email || !password || !firstName || !lastName) {
    req.flash("registerError", "All Fields Required");
    res.redirect("/register");
    return;
  }
  const candidate = await User.findOne({ email });
  if (candidate) {
    req.flash("registerError", "This User Already Exists");
    res.redirect("/register");
    return;
  }
  if (password.length < 3) {
    req.flash("registerError", "Password Must Contain At Least 3 Elements");
    res.redirect("/register");
    return;
  }
  const user = await User.create(userData);
  const token = generateJwtToken(user._id);
  res.cookie("token", token, { httpOnly: true, secure: true });
  res.redirect("/");
});

export default router;
