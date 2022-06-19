require("dotenv").config();
const express = require("express");
const connectToMongo = require("./db");
var cors = require("cors");

connectToMongo();

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));

// add middleware for sending json
app.use(express.json());

//Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/complaint", require("./routes/complaint"));

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 4848;

app.listen(PORT, () => {
  console.log("Port is listining on " + PORT);
});
