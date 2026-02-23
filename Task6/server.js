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


//task1

// register student (needed for trigger)
app.post("/register",(req,res)=>{

    const { firstName,lastName,email,phno,studentid,dept,DOB } = req.body;

    const sql = `
    INSERT INTO Student(firstName,lastName,email,phno,studentid,dept,DOB)
    VALUES(?,?,?,?,?,?,?)
    `;

    db.query(sql,[firstName,lastName,email,phno,studentid,dept,DOB],(err)=>{
        if(err){
            console.log(err);
            return res.json({success:false});
        }
        res.json({success:true,message:"Student Registered"});
    });
});


//task2
// 2️⃣ GET ALL STUDENTS (READ)
// =====================================================
app.get("/students", (req, res) => {

    const sql = "SELECT * FROM Student ORDER BY firstName ASC";

    db.query(sql, (err, result) => {
        if(err){
            console.log("FETCH ERROR:", err);
            res.status(500).json([]);
        } else{
            res.json(result);
        }
    });
});


//task3

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

//task4
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


//Task5
app.post("/pay", (req,res)=>{

    const {sender, receiver, amount} = req.body;

    // start transaction
    db.beginTransaction(err=>{
        if(err) return res.json({success:false,message:"Transaction error"});

        // 1️⃣ check sender balance
        const checkBalance = "SELECT balance FROM Accounts WHERE account_id=?";

        db.query(checkBalance,[sender],(err,result)=>{

            if(err){
                return db.rollback(()=>{
                    res.json({success:false,message:"Error checking balance"});
                });
            }

            const balance = result[0].balance;

            if(balance < amount){
                return db.rollback(()=>{
                    res.json({success:false,message:"Insufficient Balance"});
                });
            }

            // 2️⃣ deduct money from sender
            const deduct = "UPDATE Accounts SET balance = balance - ? WHERE account_id=?";

            db.query(deduct,[amount,sender],(err)=>{
                if(err){
                    return db.rollback(()=>{
                        res.json({success:false,message:"Debit failed"});
                    });
                }

                // 3️⃣ add money to receiver
                const credit = "UPDATE Accounts SET balance = balance + ? WHERE account_id=?";

                db.query(credit,[amount,receiver],(err)=>{
                    if(err){
                        return db.rollback(()=>{
                            res.json({success:false,message:"Credit failed"});
                        });
                    }

                    // 4️⃣ insert transaction history
                    const history = `
                    INSERT INTO Transactions(sender_id,receiver_id,amount,status)
                    VALUES(?,?,?,'SUCCESS')
                    `;

                    db.query(history,[sender,receiver,amount],(err)=>{
                        if(err){
                            return db.rollback(()=>{
                                res.json({success:false,message:"History failed"});
                            });
                        }

                        // 5️⃣ COMMIT
                        db.commit(err=>{
                            if(err){
                                return db.rollback(()=>{
                                    res.json({success:false,message:"Commit failed"});
                                });
                            }

                            res.json({success:true,message:"Payment Successful"});
                        });
                    });
                });
            });
        });
    });
});


// get audit logs
app.get("/logs",(req,res)=>{

    const sql = "SELECT * FROM AuditLog ORDER BY action_time DESC";

    db.query(sql,(err,result)=>{
        if(err){
            console.log("LOG ERROR:", err);
            return res.status(500).json({error:err.message});
        }
        res.json(result);
    });
});

app.get("/daily-report",(req,res)=>{

    const sql = "SELECT * FROM DailyActivityReport";

    db.query(sql,(err,result)=>{
        if(err){
            console.log("VIEW ERROR:", err);
            return res.status(500).json({error:err.message});
        }
        res.json(result);
    });
});




// // And it only accepts POST requests.
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
