const express = require("express");
const app = express();
const cors = require("cors");

//convert json form
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

//Cors
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

//Listening Port
const server = app.listen(PORT, console.log(`Server is running on ${PORT}`));
