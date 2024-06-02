const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require("cors");
require("dotenv").config();
const app = express();
const cookieParser = require('cookie-parser');
const db = require("./app/config/db.js");
const PORT = process.env.PORT || 8080;
//router
const employeeRouter = require("./app/routes/employee.router.js")

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
//parse file 
app.use(fileUpload());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//cookie parser
app.use(cookieParser());

db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });


app.use("/api/employee", employeeRouter)


// set port, listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});