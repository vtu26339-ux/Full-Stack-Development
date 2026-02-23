// dependencies required
const express = require("express"); // creates the web server
const mysql = require("mysql2"); // lets Node.js communicate with mysql db
const cors = require("cors"); // allow your frontend to access dashboard (backend and frontend runs in two seperate localhosts(diff ports) helps to fix it)
const bodyParser = require("body-parser");

//backend API server creation
const app = express(); 

//middleware
app.use(cors()); //allows cross-origin request
app.use(express.json()); //converts json data to js obj

// initialize MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",   // XAMPP default is empty
    database: "RegistrartionForm"
});

// establish connection
db.connect(err => {
    if(err) console.log(err);
    else console.log("MySQL Connected");
});

// API route  this creates an API endpoint // http://127.0.0.1:5500/Task1/Task1Frontend/index.html
app.post("/register", (req, res) => {

    const { firstName, lastName, email, phno, id, dept, DOB } = req.body; // the attributes to collect is requested 

    const sql = "INSERT INTO Student (firstName, lastName, email, phno, id, dept, DOB) VALUES (?, ?, ?,?,?,?,?)";

    db.query(sql, [firstName, lastName, email, phno, id, dept, DOB], (err, result) => { // takes values from form
        // this msg goes back to your frontend
        if(err){
            console.log("DB ERROR:", err);
            res.json({message:"Database error"});
        }else{
            res.json({message:"Registration successful"});
        }
    });
});

// And it only accepts POST requests.
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
