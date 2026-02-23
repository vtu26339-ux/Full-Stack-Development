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


app.get("/orders/history", (req,res)=>{

const sql = `
SELECT c.name, p.product_name, oi.quantity, p.price,
(oI.quantity * p.price) AS total_price, o.order_date
FROM Customers c
JOIN Orders o ON c.customer_id = o.customer_id
JOIN OrderItems oi ON o.order_id = oi.order_id
JOIN Products p ON oi.product_id = p.product_id
ORDER BY o.order_date DESC
`;

db.query(sql,(err,result)=>{
    if(err){
        console.log(err);
        res.json([]);
    } else{
        res.json(result);
    }
});
});


app.get("/orders/highest", (req,res)=>{

const sql = `
SELECT c.name, SUM(p.price*oi.quantity) AS order_value
FROM Customers c
JOIN Orders o ON c.customer_id=o.customer_id
JOIN OrderItems oi ON o.order_id=oi.order_id
JOIN Products p ON oi.product_id=p.product_id
GROUP BY o.order_id
ORDER BY order_value DESC
LIMIT 1
`;

db.query(sql,(err,result)=>{
    res.json(result);
});
});


app.get("/customers/active",(req,res)=>{

const sql = `
SELECT c.name, COUNT(o.order_id) AS total_orders
FROM Customers c
JOIN Orders o ON c.customer_id=o.customer_id
GROUP BY c.customer_id
ORDER BY total_orders DESC
LIMIT 1
`;

db.query(sql,(err,result)=>{
    res.json(result);
});
});

// // And it only accepts POST requests.
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
