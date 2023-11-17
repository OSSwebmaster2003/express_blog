import { Router } from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/auth.js";
import userMiddleware from "../middleware/user.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await Product.find().lean();
  console.log(req.userId);
  res.render("index", {
    title: "Home page | Otabek",
    products: products.reverse(),
    userId: req.userId ? req.userId.toString() : null,
  });
});

router.get("/products", async (req, res) => {
  const user = req.userId ? req.userId.toString() : null;
  const myProducts = await Product.find({ user }).populate("user").lean();
  res.render("products", {
    title: "Products | Otabek",
    isProducts: true,
    myProducts,
  });
});

router.get("/add", authMiddleware, (req, res) => {
  res.render("add", {
    title: "Add | Otabek",
    isAdd: true,
    AddProductError: req.flash("AddProductError"),
  });
});

router.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate("user").lean();
  res.render("product", {
    product: product,
  });
});
router.get("/edit-product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate("user").lean();
  res.render("editProduct", {
    product,
    EditProductError: req.flash("EditProductError"),
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

router.post("/edit-product/:id", async (req, res) => {
  const { title, description, image, price } = req.body;
  const id = req.params.id;
  if (!title || !description || !image || !price) {
    req.flash("EditProductError", "All fields required");
    res.redirect(`/edit-product/${id}}`);
    return;
  }
  await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.redirect("/products");
});
export default router;
