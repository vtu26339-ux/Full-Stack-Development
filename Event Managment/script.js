const API = "http://localhost:3000";
let currentUser = null;
let selectedEvent = null;

window.onload = loadEvents;

function openAuth(){
  document.getElementById("authModal").style.display="flex";
}

function closeAuth(){
  document.getElementById("authModal").style.display="none";
}

function register(){
fetch(API+"/register",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
name:document.getElementById("name").value,
email:document.getElementById("email").value,
password:document.getElementById("password").value
})
})
.then(r=>r.text())
.then(msg=>alert(msg));
}

function login(){
fetch(API+"/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
email:document.getElementById("lemail").value,
password:document.getElementById("lpassword").value
})
})
.then(r=>r.json())
.then(data=>{
if(data.id){
currentUser=data;
closeAuth();
alert("Welcome "+data.name);
}else{
alert("Invalid credentials");
}
});
}

function loadEvents(){
fetch(API+"/events")
.then(r=>r.json())
.then(events=>{
let html="";
events.forEach(e=>{
html+=`
<div class="card">
<h3>${e.title}</h3>
<p>${e.description}</p>
<p><b>Date:</b> ${e.event_date}</p>
<p><b>Venue:</b> ${e.venue}</p>
<p><b>Price:</b> ₹${e.price}</p>
<button onclick="book(${e.id})">Book Ticket</button>
</div>`;
});
document.getElementById("events").innerHTML=html;
});
}

function book(eventId){

  if(!currentUser){
    alert("Please login first");
    openLogin();
    return;
  }

  selectedEvent = eventId;

  document.getElementById("bookingModal").style.display="flex";
}

function confirmBooking(){
  fetch(API+"/book",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      user_id:currentUser.id,
      event_id:selectedEvent.id,
      seats_booked:1
    })
  })
  .then(r=>r.text())
  .then(msg=>{
    alert("Booking Successful!");
    goHome();
  });
}

function closeBooking(){
document.getElementById("bookingModal").style.display="none";
}

function goHome(){
  document.getElementById("bookingPage").style.display="none";
  document.querySelector(".events-section").style.display="block";
}

function openLogin(){
  document.getElementById("authModal").style.display="flex";
  showLogin();
}

function openRegister(){
  document.getElementById("authModal").style.display="flex";
  showRegister();
}

function showLogin(){
  document.getElementById("loginForm").style.display="block";
  document.getElementById("registerForm").style.display="none";
}

function showRegister(){
  document.getElementById("loginForm").style.display="none";
  document.getElementById("registerForm").style.display="block";
}
function submitBooking(){

fetch(API+"/book",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({

user_id: currentUser.id,
event_id: selectedEvent,
seats_booked: 1,

name: document.getElementById("bname").value,
email: document.getElementById("bemail").value,
phone: document.getElementById("bphone").value,
paid: document.getElementById("bpaid").value

})
})

.then(r=>r.text())
.then(msg=>{

let paidStatus = document.getElementById("bpaid").value;

if(paidStatus === "yes"){
alert("✅ Ticket Booked Successfully!");
}
else{
alert("⚠ Ticket Reserved. Please complete payment at the venue.");
}

closeBooking();
});
}