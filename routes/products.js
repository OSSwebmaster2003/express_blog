import { Router } from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/auth.js";
import userMiddleware from "../middleware/user.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Home page | Otabek",
  });
});

router.get("/products", (req, res) => {
  res.render("products", {
    title: "Products | Otabek",
    isProducts: true,
  });
});

router.get("/add", authMiddleware, (req, res) => {
  res.render("add", {
    title: "Add | Otabek",
    isAdd: true,
    AddProductError: req.flash("AddProductError"),
  });
});

router.post("/add-product", userMiddleware, async (req, res) => {
  const { title, description, image, price } = req.body;
  if (!title || !description || !image || !price) {
    req.flash("AddProductError", "All fields required");
    res.redirect("/add");
    return;
  }
  await Product.create({ ...req.body, user: req.userId });
  res.redirect("/");
});
export default router;
