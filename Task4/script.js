const btn = document.getElementById("loginBtn");
const msg = document.getElementById("msg");

btn.addEventListener("click", async (e)=>{
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if(email === "" || password === ""){
        msg.textContent = "Please enter email and password";
        msg.style.color = "red";
        return;
    }

    try{
        const res = await fetch("http://localhost:5000/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({email,password})
        });

        const data = await res.json();

        if(data.success){
            msg.style.color = "green";
            msg.textContent = "Login Successful!";
            localStorage.setItem("isLoggedIn", "true");

            window.location.href = "hello.html";
        }
        // check login
        if(localStorage.getItem("isLoggedIn") !== "true"){
            window.location.href = "login.html";
        }

        else{
            msg.style.color = "red";
            msg.textContent = data.message;
        }

    }catch(err){
        msg.textContent = "Server not reachable";
        msg.style.color = "red";
    }
});
