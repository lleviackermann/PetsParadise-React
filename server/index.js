import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js";
import foodRoutes from "./routes/food.js";
import petRoutes from "./routes/pets.js";
import appointmentRoutes from "./routes/appointment.js";
import accessoryRoutes from "./routes/accessory.js";
import employeeRoutes from "./routes/employee.js";
import Count from "./models/Count.js";
import adminRoutes from "./routes/admin.js";
import { verifyToken } from "./middleware/authverfication.js";
import { sendFeedback } from "./controllers/admin.js";
import { errorHandler } from "./middleware/errormiddleware.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(
  morgan(":date[web] :method :url :status :response-time ms", {
    stream: fs.createWriteStream(path.join(__dirname, "petsParadise.log"), {
      flags: "a",
    }),
  })
);
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/client"));

app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// app.use(csrf({ cookie: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use("/auth", authRoutes);
app.use("/employee", employeeRoutes);
app.use("/post", dataRoutes);
app.use("/pets", petRoutes);
app.use("/food", foodRoutes);
app.use("/accessory", accessoryRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/profile/admin", verifyToken, adminRoutes);
app.post("/sendFeedback", sendFeedback);

app.get("/csrf-token", (req, res) => {
  return res.status(200).json({ csrfToken: req.csrfToken() });
});
app.get("/", async (req, res) => {
  console.log("Home request");
  res.render("index.ejs");
});

app.get("/updatecount", async (req, res) => {
  const count = await Count.findOne({ countId: "100" });
  console.log(count);
  const views = count.countViews + 1;
  console.log(views);
  await Count.findOneAndUpdate({ countId: "100" }, { countViews: views });
  res.json({ views });
});

app.get("/upload", async (req, res) => {
  res.render("upload.ejs");
});

app.post("/upload");

app.use(errorHandler);
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server Started Successfully on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
