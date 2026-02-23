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
// app.post("/register", (req, res) => {

//     const { firstName, lastName, email, phno, id, dept, DOB } = req.body; // the attributes to collect is requested 

//     const sql = "INSERT INTO Student (firstName, lastName, email, phno, id, dept, DOB) VALUES (?, ?, ?,?,?,?,?)";

//     db.query(sql, [firstName, lastName, email, phno, id, dept, DOB], (err, result) => { // takes values from form
//         // this msg goes back to your frontend
//         if(err){
//             console.log("DB ERROR:", err);
//             res.json({message:"Database error"});
//         }else{
//             res.json({message:"Registration successful"});
//         }
//     });
// });


// 2️⃣ GET ALL STUDENTS (READ)
// =====================================================
// app.get("/students", (req, res) => {

//     const sql = "SELECT * FROM Student ORDER BY firstName ASC";

//     db.query(sql, (err, result) => {
//         if(err){
//             console.log("FETCH ERROR:", err);
//             res.status(500).json([]);
//         } else{
//             res.json(result);
//         }
//     });
// });

// 3️⃣ FILTER BY DEPARTMENT
// URL: /students/department/CSE
// =====================================================
// app.get("/students/department/:dept", (req, res) => {

//     const dept = req.params.dept;

//     const sql = "SELECT * FROM Student WHERE dept = ?";

//     db.query(sql, [dept], (err, result) => {
//         if(err){
//             console.log("FILTER ERROR:", err);
//             res.status(500).json([]);
//         } else{
//             res.json(result);
//         }
//     });
// });

// 4️⃣ COUNT STUDENTS PER DEPARTMENT
// =====================================================
// app.get("/students/count", (req, res) => {

//     const sql = `
//     SELECT dept, COUNT(*) AS total
//     FROM Student
//     GROUP BY dept
//     ORDER BY dept ASC
//     `;

//     db.query(sql, (err, result) => {
//         if(err){
//             console.log("COUNT ERROR:", err);
//             res.status(500).json([]);
//         } else{
//             res.json(result);
//         }
//     });
// });


// TEST ROUTE (VERY IMPORTANT FOR DEBUGGING)
// =====================================================
// app.get("/", (req,res)=>{
//     res.send("Backend Running");
// });


// // ===== Start Server =====
// app.listen(5000, () => {
//     console.log("Server running on port 5000");
// });





// LOGIN ROUTE
app.post("/login",(req,res)=>{

    const {email,password} = req.body;

    const sql = "SELECT * FROM Auth WHERE email = ? AND password = ?";

    db.query(sql,[email,password],(err,result)=>{

        if(err){
            console.log(err);
            return res.json({success:false,message:"Server error"});
        }

        if(result.length > 0){
            res.json({success:true});
        }else{
            res.json({success:false,message:"Invalid email or password"});
        }
    });
});


// // And it only accepts POST requests.
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
