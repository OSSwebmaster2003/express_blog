import { Router } from "express";
import Product from "../models/Product.js";

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

router.get("/add", (req, res) => {
  res.render("add", {
    title: "Add | Otabek",
    isAdd: true,
  });
});

router.post("/add-product", async (req, res) => {
  const { title, description, image, price } = req.body;
  const products = await Product.create(req.body);
  console.log(products);
  res.redirect("/");
});
export default router;
