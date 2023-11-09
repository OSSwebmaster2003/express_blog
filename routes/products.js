import { Router } from "express";

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

export default router;
