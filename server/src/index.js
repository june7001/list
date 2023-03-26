const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute");
const listRoute = require("./routes/listRoute");
const itemRoute = require("./routes/itemRoute");
const friendRoute = require("./routes/friendRoute");

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());

// Routes
app.use("/", authRoute);
app.use("/", listRoute);
app.use("/", itemRoute);
app.use("/", friendRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
