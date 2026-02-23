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


// PAYMENT API (TRANSACTION)
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


// // And it only accepts POST requests.
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
