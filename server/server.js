const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");
const connectDB = require('./CONFIG/DB')
app.use(logger("dev"));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

dotenv.config();

connectDB()

app.get("/", (req, res) => {
  res.send("APIs Up && running");
});

app.use('/api/auth',require('./ROUTES/Auth')) //Auth Api
app.use('/api',require('./ROUTES/User')) //User Api

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server running at port:${port}`);
});
