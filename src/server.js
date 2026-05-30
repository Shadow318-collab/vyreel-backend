const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Vyreel backend is live");
});

app.get("/health", (req, res) => {
  res.json({
    status: "online"
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, function () {
  console.log("VYREEL API running on port " + PORT);
});
