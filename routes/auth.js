import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login | Otabek",
    isLogin: true,
  });
});
router.post("/login", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

router.get("/register", (req, res) => {
  res.render("register", {
    title: "Register | Otabek",
    isRegister: true,
  });
});
router.post("/register", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

export default router;
