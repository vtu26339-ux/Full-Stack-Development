const msg = document.getElementById("msg");

function isEmpty(value){
    return value.trim() === "";
}

function validEmail(email){
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

function validRating(rating){
    return rating >=1 && rating <=5;
}

document.getElementById("name").addEventListener("keyup", function(){
    if(isEmpty(this.value)){
        msg.textContent = "Name cannot be empty";
        msg.style.color="red";
    } else{
        msg.textContent = "";
    }
});

document.getElementById("email").addEventListener("keyup", function(){
    if(!validEmail(this.value)){
        msg.textContent = "Invalid email format";
        msg.style.color="red";
    } else{
        msg.textContent="";
    }
});


document.getElementById("submitBtn").addEventListener("dblclick", function(){

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const rating = document.getElementById("rating").value;
    const message = document.getElementById("message").value;

    if(isEmpty(name) || isEmpty(email) || isEmpty(message)){
        msg.textContent="Please fill all fields!";
        msg.style.color="red";
        return;
    }

    if(!validEmail(email)){
        msg.textContent="Enter valid email!";
        msg.style.color="red";
        return;
    }

    if(!validRating(rating)){
        msg.textContent="Rating must be between 1 and 5";
        msg.style.color="red";
        return;
    }

    msg.textContent="Feedback Submitted Successfully!";
    msg.style.color="green";
});
