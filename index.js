import express from "express";
import { create } from "express-handlebars";
import mongoose from "mongoose";
import AuthRoutes from "./routes/auth.js";
import ProductRoutes from "./routes/products.js";
import flash from "connect-flash";
import session from "express-session";
import token from "./middleware/token.js";
import cookieParser from "cookie-parser";
import userMiddleware from "./middleware/user.js";
import hbsHelper from "./util/index.js";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: hbsHelper,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(session({ secret: "Otabek", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(cookieParser());
app.use(token);
app.use(userMiddleware);

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
