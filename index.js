import express from "express";
import { create } from "express-handlebars";
import mongoose from "mongoose";
import AuthRoutes from "./routes/auth.js";
import ProductRoutes from "./routes/products.js";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.use(AuthRoutes);
app.use(ProductRoutes);

const startApp = () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    });

    const PORT = process.env.PORT || 4100;
    app.listen(PORT, () => {
      console.log(`Server running on Port : ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();
