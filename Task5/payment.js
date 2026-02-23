document.getElementById("payBtn").addEventListener("click", async ()=>{

    const sender = document.getElementById("sender").value;
    const receiver = document.getElementById("receiver").value;
    const amount = document.getElementById("amount").value;

    const res = await fetch("http://localhost:5000/pay",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({sender,receiver,amount})
    });

    const data = await res.json();

    const msg = document.getElementById("msg");

    msg.textContent = data.message;
    msg.style.color = data.success ? "green" : "red";
});
