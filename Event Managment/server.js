const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "eventListener"
    
});

// User Registration API
app.post('/register', (req,res)=>{
    const {name,email,password} = req.body;

    const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

    db.query(sql,[name,email,password],(err,result)=>{
        if(err) return res.send("Email already exists");
        res.send("Registered Successfully");
    });
});

// Login API
app.post('/login',(req,res)=>{
    const {email,password} = req.body;

    const sql = "SELECT * FROM users WHERE email=? AND password=?";

    db.query(sql,[email,password],(err,result)=>{
        if(result.length>0)
            res.json(result[0]);
        else
            res.json({});
    });
});

// for spare if the database is not working spare data (Events)
// app.get('/seed',(req,res)=>{
// db.query(`INSERT INTO events 
// (title, description, event_date, venue, price, total_seats)
// VALUES 
// ('AI Summit','Future of AI','2026-06-15','Chennai',1200,150)`);
// res.send("Seeded");
// });

// Create Event (Admin)
app.post('/addevent',(req,res)=>{
    const {title,description,event_date,venue,price,total_seats} = req.body;

    const sql = "INSERT INTO events (title,description,event_date,venue,price,total_seats) VALUES (?,?,?,?,?,?)";

    db.query(sql,[title,description,event_date,venue,price,total_seats],()=>{
        res.send("Event Added");
    });
});

// Get Events
app.get('/events',(req,res)=>{
    db.query("SELECT * FROM events",(err,result)=>{
        res.json(result);
    });
});

// Book Ticket
app.post('/book',(req,res)=>{

const {user_id,event_id,seats_booked,name,email,phone,paid} = req.body;

const sql = `
INSERT INTO bookings
(user_id,event_id,seats_booked,name,email,phone,paid)
VALUES (?,?,?,?,?,?,?)
`;

db.query(sql,[user_id,event_id,seats_booked,name,email,phone,paid],()=>{
res.send("Booking Successful");
});

});

app.listen(3000,()=>console.log("Server running on port 3000"));

db.connect(err => {
    if(err) throw err;
    console.log("MySQL Connected");
});