const btn = document.querySelector(".btn");
const msg = document.querySelector(".msg");
btn.addEventListener("click",(e)=>{
    e.preventDefault();   // VERY IMPORTANT (forms reload page)

    const firstNameVal = document.getElementById("firstName").value.trim();
    const lastNameVal  = document.getElementById("lastName").value.trim();
    const emailVal     = document.getElementById("email").value.trim();
    const phnoVal      = document.getElementById("phno").value.trim();
    const idVal        = document.getElementById("id").value.trim();
    const deptVal      = document.getElementById("dept").value.trim();
    const DOBVal       = document.getElementById("DOB").value.trim();

    fetch("http://localhost:5000/register", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        firstName: firstNameVal,
        lastName: lastNameVal,
        email: emailVal,
        phno:phnoVal,
        id:idVal,
        dept:deptVal,
        DOB:DOBVal
    })
})
.then(res => res.json())
.then(data => {
    msg.textContent = data.message;
    msg.style.color = "green";
})
.catch(err => {
    msg.textContent = "Server error";
    msg.style.color = "red";
});

})