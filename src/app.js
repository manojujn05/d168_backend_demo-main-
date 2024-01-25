require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const User = require("./routes/UserRouter");

const PORT = process.env.PORT || 3000;
require("./database/connection");
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(cors());

app.use(User);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
