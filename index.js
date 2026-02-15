require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/users");
const bookRoutes = require("./routes/books");
const userBookRoutes = require("./routes/userBooks");

//middleware
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`));

const connection = require("./db");
connection();

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/userBooks", userBookRoutes);
