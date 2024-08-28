import dotenv from "dotenv";
import express from "express";
import router from "./routes/index.ts";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());
app.get("/", (req, res) => {
  res.send("Server Started!");
});

app.use(router);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//use hooks for the case of password, bcrypt in models, make this in hook
//create scope in users model, for one case scope is not needed while needed for other
//use package of http status
//make settings.js file, import all environmental variable there.
