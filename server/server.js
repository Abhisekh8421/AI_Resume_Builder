import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./configs/db.js";

const PORT = process.env.PORT || 3000;
const app = express();

//Database connection
await connectDb();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is live.....");
});

app.listen(PORT, () => {
  console.log(`Server is running on  port : ${PORT}`);
});
